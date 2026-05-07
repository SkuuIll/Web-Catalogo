import { SkeletonProductDetail } from '@/components/ui/Skeleton'

export default function ProductoLoading() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <SkeletonProductDetail />
    </div>
  )
}
