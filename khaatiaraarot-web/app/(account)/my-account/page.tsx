import { redirect } from "next/navigation";

export default function AccountRootPage() {
  redirect("/my-account/profile");
}