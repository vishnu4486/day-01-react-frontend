import React, { useEffect, useState } from "react";
import useFetchData from "./useFetchData";

function Product() {
  const [search, setSearch] = useState("");
  const [filterProducts, setFilterProducts] = useState([]);
  const [pagination, setPagination] = useState({
    start: 0,
    end: 10,
    currentPage: 1,
    perPage: 10,
  });
  const [pageList, setPageList] = useState([]);

  const { postList, loading, error } = useFetchData(
    "https://jsonplaceholder.typicode.com/posts",
  );

  useEffect(() => {
    let pageListLocal = [...postList];
    if (pageListLocal.length > 0) {
      pageListLocal = pageListLocal.filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase()),
      );
      let list = [];
      for (let i = 1; i < pageListLocal.length; i = i + pagination.perPage) {
        list.push(i);
      }
      setPageList(list);
      setFilterProducts(pageListLocal.slice(pagination.start, pagination.end));
    }
  }, [postList, pagination, search]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const tableHeader = [
    { key: "id", title: "Id" },
    { key: "title", title: "Title" },
    { key: "body", title: "Body" },
  ];
  let timer = null;
  const changeHandler = (event) => {
    clearTimeout(timer);

    setTimeout(() => {
      setSearch(event.target.value);
    }, 3000);
  };

  const changePage = (id) => {
    setPagination({
      start: id * pagination.perPage - pagination.perPage,
      end: id * pagination.perPage,
      currentPage: id,
      perPage: pagination.perPage,
    });
  };
  return (
    <>
      <input
        type="text"
        placeholder="Search product"
        style={{ margin: "30px", padding: "10px" }}
        onChange={changeHandler}
      />
      <table>
        <tr>
          {tableHeader.map((header) => {
            return <th>{header.title}</th>;
          })}
        </tr>
        <tbody>
          {filterProducts.map((product) => {
            return (
              <tr>
                {tableHeader.map((header) => {
                  return <td>{product[header.key]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <ul>
        {pageList.map((d, index) => {
          return (
            <li onClick={() => changePage(index + 1)} key={index}>
              {index + 1}
            </li>
          );
        })}
      </ul>
    </>
  );
}
export default Product;
