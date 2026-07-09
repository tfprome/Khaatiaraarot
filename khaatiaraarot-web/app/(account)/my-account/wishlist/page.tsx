"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import AccountPageHeader from "@/components/account/accountpageHeader";
import EmptyState from "@/components/account/emptystate";
import WishlistCard from "@/components/account/wishlistcard";
import { fetchWishlist, removefromwishlist } from "@/lib/wishlistApi";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'
import { wishlistType } from "@/Types/wishTypes";
import { useAppSelector } from "@/store/hooks";
import PaginationControls from "@/components/pagination/paginationcontrol";
import {addToCart} from "@/lib/cartApi";
import WishlistSkeleton from "@/components/skeleton/wishlistSkeleton";


export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<wishlistType[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const [addingToCart, setAddingToCart] = useState(false);
  const [deletingItem, setDeletingItem] = useState<boolean>(false); // Track the ID of the item being deleted
  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);
  //console.log(isAuthenticated)

  const handleAddToCart = async (id: string,quantity: number) => {
      try {
        setAddingToCart(true);
  
        const res = await addToCart(id, quantity);
        //dispatch(setItemCount(res.data.itemCount));
  
        toast("Added to your cart.", {
          position: "top-center",
          autoClose: 1000, // 0.5 second
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          className: 'cart-success-toast'
        });
      } catch (error: any) {
        //console.error("Failed to add item", error.message);
        toast.error(error.response?.data?.message || "Failed to add item", {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: true,
          className: "error-toast"
        });
      } finally {
        setAddingToCart(false);
      }
    };

  useEffect(() => {
    const getWishlist = async () => {
      try {
        const res = await fetchWishlist(page, limit);
        //console.log(res)
        setWishlist(res.data);
        setTotal(res.data.total)
      } catch (error: any) {
        if (error?.status === 401) {
          router.push("/login");
          toast("Please login to view your profile", {
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            className: 'success-toast'
          });
        }
        //console.log("Failed to fetch orders:", error);
      }
      finally {
        setLoading(false);
      }
    };
    getWishlist();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);
  //console.log(totalPages)

  const handleDeleteItem = async (productId: string) => {
    try {
      setDeletingItem(true); // Set the ID of the item being deleted
      const res = await removefromwishlist(productId);
      setWishlist(res.data);
      toast('Wish item deleted', {
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        className: 'success-toast'
      });
    } catch (error) {
      console.error("Failed to delete wish item", error);
      toast("Failed to delete wish item", {
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        className: 'error-toast'
      });
    }
    finally {
      setDeletingItem(false); // Reset the deleting state
    }
  };
  console.log(wishlist)

  if(loading) {
    return <WishlistSkeleton />
  }

  return (
    <>
      <AccountPageHeader title="My Wishlist" description="Items you've saved for later" />
      <div className="bg-white rounded-2xl border border-[#f0e8e7] shadow-sm p-5 sm:p-7">
        {wishlist.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            message="Save items you love and come back to them anytime."
            action={{ label: "Browse products", href: "/shop" }}
          />
        ) : (
          <div className="space-y-3">
            {wishlist.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onclick={() => { router.push(`/shop/${item.product.id}`) }}
                onRemove={() => { handleDeleteItem(item.product.id) }}
                onAddToCart={()=> {handleAddToCart(item.product.id, 1)}}
                AddingtoCart={addingToCart}
                deletingItem={deletingItem}
              />
            ))}
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </>
  );
}