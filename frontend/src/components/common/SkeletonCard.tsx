export function ProductCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton h-56 w-full" />
      <div className="p-5">
        <div className="skeleton h-4 w-20 mb-3" />
        <div className="skeleton h-6 w-3/4 mb-2" />
        <div className="skeleton h-4 w-full mb-4" />
        <div className="skeleton h-5 w-24" />
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton h-48 w-full" />
      <div className="p-5">
        <div className="skeleton h-3 w-24 mb-3" />
        <div className="skeleton h-6 w-3/4 mb-2" />
        <div className="skeleton h-4 w-full mb-1" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="skeleton h-64 w-full rounded-xl" />
  );
}

export function DetailSkeleton() {
  return (
    <div className="container-section py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="skeleton h-96 w-full rounded-xl" />
        <div>
          <div className="skeleton h-4 w-24 mb-4" />
          <div className="skeleton h-10 w-3/4 mb-4" />
          <div className="skeleton h-6 w-32 mb-6" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-2/3 mb-8" />
          <div className="skeleton h-12 w-48" />
        </div>
      </div>
    </div>
  );
}
