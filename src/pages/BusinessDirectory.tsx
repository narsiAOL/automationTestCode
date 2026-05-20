import { useTranslation } from "react-i18next";
import {
  Divider,
  FunctionalButton,
  SearchBar,
  SectionTitle,
  Table,
  BusinessCard,
  HorizontalDivider,
  type ColumnDef,
} from "../components/ui";
import type { SortKey } from "../components/ui/FunctionalButton";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import {
  useBusinessDirectory,
  type BusinessDirectoryItem,
} from "../hooks/useBusinessDirectory";
import Loader from "../components/ui/Loader";
import { filtersService } from "../services/filters";
import TableBg from "../components/ui/Table/TableBg";
import TableHeaderLeftDesign from "../components/ui/Table/TableHeaderLeftDesign";
import TableHeaderRightDesign from "../components/ui/Table/TableHeaderRightDesign";
type SortOrder = "asc" | "desc";
type BusinessSortField =
  | "page_number"
  | "kutumb_number"
  | "business_name"
  | "business_category"
  | "created_date"
  | "";

const DEFAULT_LIMIT = 10;

export default function BusinessDirectory() {
  const { t } = useTranslation();

  // Table columns definition
  const columns: ColumnDef<BusinessDirectoryItem>[] = [
    // {
    //   id: "pageNo",
    //   header: t("businessDirectory.columns.pageNo"),
    //   accessorKey: "page_number",
    //   size: 120,
    //   cell: ({ row }) => (
    //     <div className="text-business-info">{row.original.page_number}</div>
    //   ),
    // },
    {
      id: "fullName",
      header: t("businessDirectory.columns.fullName"),
      accessorKey: "full_name",
      size: 150,
      cell: ({ row }) => (
        <div className="text-business-info">{row.original.full_name}</div>
      ),
    },
    {
      id: "businessName",
      header: t("businessDirectory.columns.businessName"),
      accessorKey: "business_name",
      size: 280,
      cell: ({ row }) => (
        <div className="text-business-info">{row.original.business_name}</div>
      ),
    },
    // {
    //   id: "category",
    //   header: t("businessDirectory.columns.category"),
    //   accessorKey: "business_category",
    //   size: 200,
    //   cell: ({ row }) => (
    //     <div className="text-business-info">
    //       {row.original.business_category}
    //     </div>
    //   ),
    // },
    {
      id: "address",
      header: t("businessDirectory.columns.address"),
      accessorKey: "full_address",
      size: 400,
      cell: ({ row }) => (
        <div className="text-business-info">{row.original.full_address}</div>
      ),
    },
    {
      id: "email",
      header: t("businessDirectory.columns.email"),
      accessorKey: "business_email",
      size: 300,
      cell: ({ row }) => (
        <div className="text-business-info">{row.original.business_email}</div>
      ),
    },
    {
      id: "contactNo",
      header: t("businessDirectory.columns.contactNo"),
      accessorKey: "business_phone",
      size: 240,
      cell: ({ row }) => (
        <div className="text-business-info">{row.original.business_phone}</div>
      ),
    },
    {
      id: "website",
      header: t("businessDirectory.columns.website"),
      accessorKey: "business_website",
      size: 300,
      cell: ({ row }) => (
        <div className="text-business-info">
          {row.original.business_website}
        </div>
      ),
    },
    {
      id: "instagram",
      header: t("businessDirectory.columns.instagram"),
      accessorKey: "business_instagram",
      size: 240,
      cell: ({ row }) => (
        <div className="text-business-info">
          {row.original.business_instagram}
        </div>
      ),
    },
    {
      id: "facebook",
      header: t("businessDirectory.columns.facebook"),
      accessorKey: "business_facebook",
      size: 240,
      cell: ({ row }) => (
        <div className="text-business-info">
          {row.original.business_facebook}
        </div>
      ),
    },
  ];

  const DEFAULT_LIMIT = 10;
  // State for query params
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [sort, setSort] = useState<BusinessSortField>("");
  const [sortBy, setSortBy] = useState<SortOrder>("asc");
  const [sortKeys, setSortKeys] = useState<SortKey[]>([]);
  const [filtersLoaded, setFiltersLoaded] = useState<boolean>(false);

  const debouncedSearch = useDebounce<string>(search, 500);

  // Fetch filters on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const filterData =
          await filtersService.getFilters("business_directory");
        const extractedSortKeys = filtersService.extractSortKeys(filterData);
        setSortKeys(extractedSortKeys);

        // Set default sort to first available key
        if (extractedSortKeys.length > 0) {
          setSort(extractedSortKeys[0].value as BusinessSortField);
        }
        setFiltersLoaded(true);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
        setFiltersLoaded(true); // Still allow the page to function
      }
    };

    fetchFilters();
  }, []);
  const params = {
    search: debouncedSearch,
    sort,
    sortBy,
    page,
    limit,
  };
  const { businessDirectory, loadingState, error } =
    useBusinessDirectory(params);
  console.log("Business Directory", businessDirectory);
  const handleRowClick = (business: BusinessDirectoryItem) => {
    console.log("Clicked business:", business);
    // Handle business row click - could navigate to detail page
  };

  const handleSortKeyChange = (sortKey: string) => {
    setSort(sortKey as BusinessSortField);
  };

  console.log("Business Directory Data:", businessDirectory);

  const renderBusinessTable = () => {
    if (!filtersLoaded || loadingState === "initial") {
      return (
        <div className="min-h-96 mt-12">
          <Loader message={t("businessDirectory.loading")} />
        </div>
      );
    }
    if (!businessDirectory || businessDirectory.length === 0) {
      return (
        <div className="text-center mt-10 text-gray-500">
          {t("businessDirectory.noData")}
        </div>
      );
    }

    return (
      <>
        {/* Desktop Table View */}
        <div className="hidden lg:block mt-8 max-w-7xl mx-auto">
          <Table
            data={businessDirectory}
            columns={columns}
            onRowClick={handleRowClick}
            enableSorting={true}
            showRowNumbers={false}
            className="w-full"
            currentSortField={sort}
            currentSortOrder={sortBy}
            sortableFields={["full_name"]}
            onColumnSort={(field, order) => {
              setSort(field as BusinessSortField);
              setSortBy(order);
            }}
          />
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden mt-6 w-full px-4">
          <div className="relative w-full max-w-lg mx-auto">
            <div className="relative z-10 overflow-hidden rounded-lg border border-border-light">
              {/* Header — matches Bhakti Geet mobile style */}
              <div className="bg-[#3D2B1F] h-[42px] flex items-center px-6">
                <p
                  className="font-medium leading-[24px] text-text-link-light text-[16px] tracking-[-0.16px]"
                  style={{
                    fontFamily: "Noto Serif",
                    fontVariationSettings: "'CTGR' 0, 'wdth' 100",
                  }}
                >
                  {t("businessDirectory.title")}
                </p>
              </div>

              {/* Cards Container */}
              <div
                className="flex flex-col"
                style={{ backgroundColor: "#FBF7F3" }}
              >
                {businessDirectory.map((business, index) => (
                  <BusinessCard
                    key={`${business.page_number}-${business.kutumb_number}-${index}`}
                    business={business}
                    onClick={handleRowClick}
                  />
                ))}
                {/* Final bottom border */}
                <div className="bg-border-table h-[1.6px] w-full" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <SectionTitle title={t("businessDirectory.title")} />
      <div className="flex flex-row items-center justify-center gap-4 mt-9 max-w-[90%] md:max-w-none mx-auto">
        <SearchBar
          variant="light"
          placeholder={t("businessDirectory.searchPlaceholder")}
          className="w-full md:w-96 overflow-ellipsis"
          loading={loadingState === "search"}
          value={search}
          onChange={(value) => setSearch(value)}
        />
        <span className="hidden md:inline-block">
          <Divider color="light" />
        </span>
        <FunctionalButton
          leftText={t("ui.buttonText.filter")}
          sortKeys={sortKeys}
          selectedSortKey={sort}
          onSortKeyChange={handleSortKeyChange}
        />
      </div>

      {renderBusinessTable()}
    </>
  );
}
