import { SkeletonStats } from '@/components/ui/Skeleton'

export default function AdminLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex items-center gap-3">
        <SkeletonStats count={1} />
      </div>
      <SkeletonStats count={6} />
    </div>
  )
}
