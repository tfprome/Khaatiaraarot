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