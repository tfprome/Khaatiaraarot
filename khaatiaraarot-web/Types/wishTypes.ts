export interface wishlistType {
  id: string
  createdAt: string
  product: WishlistProduct
}

export interface WishlistProduct {
  id: string
  name: string
  slug: string
  unit: string
  price: number
  originalPrice: any
  stockQty: number
  sourceRegion: string
  image: any
}
