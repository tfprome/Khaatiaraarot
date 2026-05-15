import PDFDocument from 'pdfkit';
import type { Order, OrderItem } from '../db/schema';

type OrderWithItems = Order & { items: OrderItem[] };

interface AddressSnapshot {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  district: string;
  postalCode?: string;
}

interface ProductSnapshot {
  name: string;
  unit: string;
  price: string;
}

const COL = { item: 50, qty: 300, unitPrice: 370, total: 450 };

function row(doc: PDFKit.PDFDocument, item: string, qty: string, up: string, tot: string) {
  doc.text(item, COL.item, doc.y, { width: 240, continued: false });
  const y = doc.y - doc.currentLineHeight();
  doc.text(qty, COL.qty, y, { width: 60 });
  doc.text(up, COL.unitPrice, y, { width: 70, align: 'right' });
  doc.text(tot, COL.total, y, { width: 80, align: 'right' });
  doc.moveDown(0.3);
}

export function generateInvoicePdf(order: OrderWithItems, invoiceNumber: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const addr = order.shippingAddressSnapshot as AddressSnapshot;
    const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // ── Header ──────────────────────────────────────────────────────────────
    doc.fontSize(22).font('Helvetica-Bold').text('KHAATI AAROT', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Authentic Bengali Groceries', { align: 'center' });
    doc.moveDown(0.5);

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#cccccc')
      .stroke();
    doc.moveDown(0.5);

    // ── Invoice meta ─────────────────────────────────────────────────────────
    const metaY = doc.y;
    doc.font('Helvetica-Bold').text('INVOICE', 50, metaY);
    doc.font('Helvetica').text(`#${invoiceNumber}`, 50, metaY + 16);
    doc.text(`Date: ${date}`, 50, metaY + 30);
    doc.text(`Order: ${order.orderNumber}`, 50, metaY + 44);

    doc.font('Helvetica-Bold').text('SHIP TO', 350, metaY);
    doc.font('Helvetica').text(addr.fullName, 350, metaY + 16);
    doc.text(addr.phone, 350, metaY + 30);
    doc.text(addr.line1, 350, metaY + 44);
    if (addr.line2) doc.text(addr.line2, 350, metaY + 58);
    doc.text(`${addr.city}, ${addr.district}`, 350, metaY + (addr.line2 ? 72 : 58));

    doc.moveDown(5);

    // ── Items table header ───────────────────────────────────────────────────
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#333333')
      .stroke();
    doc.moveDown(0.3);

    doc.font('Helvetica-Bold').fontSize(10);
    row(doc, 'ITEM', 'QTY', 'UNIT PRICE', 'TOTAL');

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#cccccc')
      .stroke();
    doc.moveDown(0.3);

    // ── Items ────────────────────────────────────────────────────────────────
    doc.font('Helvetica').fontSize(10);
    for (const item of order.items) {
      const snap = item.productSnapshot as ProductSnapshot;
      row(
        doc,
        `${snap.name} (${snap.unit})`,
        String(item.quantity),
        `৳${parseFloat(item.unitPrice).toFixed(2)}`,
        `৳${parseFloat(item.totalPrice).toFixed(2)}`,
      );
    }

    doc.moveDown(0.5);
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#cccccc')
      .stroke();
    doc.moveDown(0.5);

    // ── Totals ───────────────────────────────────────────────────────────────
    const totX = 370;
    doc.font('Helvetica').text('Subtotal:', totX, doc.y);
    doc.text(`৳${parseFloat(order.subtotal).toFixed(2)}`, COL.total, doc.y - doc.currentLineHeight(), {
      width: 80,
      align: 'right',
    });
    doc.moveDown(0.3);

    if (parseFloat(order.deliveryFee) > 0) {
      doc.text('Delivery:', totX, doc.y);
      doc.text(`৳${parseFloat(order.deliveryFee).toFixed(2)}`, COL.total, doc.y - doc.currentLineHeight(), {
        width: 80,
        align: 'right',
      });
      doc.moveDown(0.3);
    }

    if (parseFloat(order.discount) > 0) {
      doc.text('Discount:', totX, doc.y);
      doc.text(`-৳${parseFloat(order.discount).toFixed(2)}`, COL.total, doc.y - doc.currentLineHeight(), {
        width: 80,
        align: 'right',
      });
      doc.moveDown(0.3);
    }

    doc.font('Helvetica-Bold').text('TOTAL:', totX, doc.y);
    doc.text(`৳${parseFloat(order.total).toFixed(2)}`, COL.total, doc.y - doc.currentLineHeight(), {
      width: 80,
      align: 'right',
    });
    doc.moveDown(1);

    // ── Footer ───────────────────────────────────────────────────────────────
    doc.font('Helvetica').fontSize(9);
    doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 50, doc.y);
    doc.text(`Status: ${order.status.toUpperCase()}`, 50, doc.y);
    doc.moveDown(1);
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#cccccc')
      .stroke();
    doc.moveDown(0.3);
    doc.fontSize(8).fillColor('#888888').text('Thank you for shopping with Khaati Aarot!', {
      align: 'center',
    });

    doc.end();
  });
}
