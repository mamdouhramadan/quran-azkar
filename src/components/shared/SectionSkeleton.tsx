import { Skeleton } from '@/components/ui/skeleton';

interface SectionSkeletonProps {
  variant: 'hero' | 'prayerGrid' | 'categories' | 'tasbih' | 'khatmah' | 'chart' | 'bookmark' | 'verse';
}

export const SectionSkeleton = ({ variant }: SectionSkeletonProps) => {
  switch (variant) {
    case 'hero':
      return (
        <div className="rounded-3xl bg-card border border-primary/10 p-6 !text-center h-full min-h-[200px] flex flex-col items-center justify-center gap-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-48" />
        </div>
      );

    case 'prayerGrid':
      return (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-24 mb-2" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      );

    case 'categories':
      return (
        <section className="mb-12">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-card border border-primary/10 p-6 !text-center">
                <Skeleton className="size-14 rounded-full mx-auto mb-4" />
                <Skeleton className="h-5 w-20 mx-auto mb-2" />
                <Skeleton className="h-3 w-28 mx-auto" />
              </div>
            ))}
          </div>
        </section>
      );

    case 'tasbih':
      return (
        <section className="mb-12 rounded-3xl bg-muted p-8 !text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto mb-8" />
          <Skeleton className="size-32 rounded-full mx-auto mb-6" />
          <Skeleton className="h-12 w-36 rounded-full mx-auto" />
        </section>
      );

    case 'khatmah':
      return (
        <section className="mb-12">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="rounded-3xl bg-card border border-primary/10 p-6 !text-center">
            <Skeleton className="size-12 rounded-full mx-auto mb-3" />
            <Skeleton className="h-10 w-16 mx-auto mb-1" />
            <Skeleton className="h-4 w-24 mx-auto mb-6" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        </section>
      );

    case 'chart':
      return (
        <section className="mb-12">
          <Skeleton className="h-8 w-44 mb-6" />
          <div className="rounded-3xl bg-card border border-primary/10 p-6">
            <div className="flex items-center justify-around mb-6">
              <div className="!text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="!text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </section>
      );

    case 'bookmark':
      return (
        <section className="mb-12">
          <div className="rounded-3xl bg-card border border-primary/10 p-6 !text-center">
            <Skeleton className="h-10 w-10 rounded-xl mx-auto mb-3" />
            <Skeleton className="h-4 w-36 mx-auto mb-2" />
            <Skeleton className="h-3 w-52 mx-auto" />
          </div>
        </section>
      );

    case 'verse':
      return (
        <section className="mb-12 rounded-3xl bg-muted/50 p-8 !text-center">
          <Skeleton className="h-10 w-10 mx-auto mb-4 rounded" />
          <Skeleton className="h-6 w-3/4 mx-auto mb-3" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-6" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </section>
      );

    default:
      return null;
  }
};
