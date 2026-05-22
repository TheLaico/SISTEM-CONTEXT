import { Link, useNavigate } from 'react-router-dom';

interface BreadcrumbProps {
  pageName: string;
  items?: Array<{
    label: string;
    to?: string;
  }>;
  showBackButton?: boolean;
  hideTitle?: boolean;
}

const Breadcrumb = ({ pageName, items, showBackButton = false, hideTitle = false }: BreadcrumbProps) => {
  const navigate = useNavigate();
  const trail = items && items.length > 0 ? items : [{ label: 'Dashboard', to: '/' }, { label: pageName }];

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-stroke px-3 py-1 text-sm font-medium transition hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
          >
            ← Volver
          </button>
        )}

        {!hideTitle && (
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            {pageName}
          </h2>
        )}
      </div>

      <nav>
        <ol className="flex items-center gap-2">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;

            return (
              <li key={`${item.label}-${index}`} className={isLast ? 'text-primary' : ''}>
                {item.to && !isLast ? <Link to={item.to}>{item.label} /</Link> : item.label}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
