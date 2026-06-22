import { LucideIcon } from "lucide-react";

export type UserProfile = {
    id: string
    email: string
    fullName: string
    phone: any
    role: string
    createdAt: string
}

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export interface accountPageHeaderProps {
  title: string;
  description: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  isDefault?: boolean;
}