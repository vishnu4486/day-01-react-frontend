import { useEffect, useRef, useState } from "react";
import useFetchData from "./useFetchData";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Pagination {
  start: number;
  end: number;
  currentPage: number;
  perPage: number;
}

function Product() {
  const [search, setSearch] = useState<string>("");

  const [filterProducts, setFilterProducts] = useState<Post[]>([]);

  const [pagination, setPagination] = useState<Pagination>({
    start: 0,
    end: 10,
    currentPage: 1,
    perPage: 10,
  });

  const [pageList, setPageList] = useState<number[]>([]);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { postList, loading, error } = useFetchData<Post[]>(
    "https://jsonplaceholder.typicode.com/posts",
  );

  // Search + Pagination
  useEffect(() => {
    let filteredData = [...(postList ?? [])];
    // Search
    if (search.trim()) {
      filteredData = filteredData.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / pagination.perPage);

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    setPageList(pages);

    // Pagination
    const paginatedData = filteredData.slice(pagination.start, pagination.end);

    setFilterProducts(paginatedData);
  }, [postList, pagination, search]);

  // Debounced search
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setSearch(value);

      // Reset pagination after search
      setPagination((prev) => ({
        ...prev,
        start: 0,
        end: prev.perPage,
        currentPage: 1,
      }));
    }, 500);
  };

  // Change page
  const changePage = (pageNumber: number) => {
    setPagination((prev) => ({
      ...prev,
      start: (pageNumber - 1) * prev.perPage,
      end: pageNumber * prev.perPage,
      currentPage: pageNumber,
    }));
  };

  const tableHeader: {
    key: keyof Post;
    title: string;
  }[] = [
    {
      key: "id",
      title: "ID",
    },
    {
      key: "title",
      title: "Title",
    },
    {
      key: "body",
      title: "Body",
    },
  ];

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search product"
        onChange={changeHandler}
        style={{
          margin: "30px",
          padding: "10px",
          width: "300px",
        }}
      />

      {/* Table */}
      <table
        border={1}
        cellPadding={10}
        cellSpacing={0}
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            {tableHeader.map((header) => (
              <th key={header.key}>{header.title}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filterProducts.length > 0 ? (
            filterProducts.map((product) => (
              <tr key={product.id}>
                {tableHeader.map((header) => (
                  <td key={header.key}>{product[header.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableHeader.length} style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          gap: "10px",
          padding: "20px",
          justifyContent: "center",
        }}
      >
        {pageList.map((page) => (
          <li
            key={page}
            onClick={() => changePage(page)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              cursor: "pointer",
              fontWeight: pagination.currentPage === page ? "bold" : "normal",
            }}
          >
            {page}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Product;
