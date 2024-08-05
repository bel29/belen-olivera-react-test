import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Pagination, Dropdown, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

import { setProducts, setCurrentPage, deleteProduct } from "../store/productSlice";
import { RootState } from "../store";
import { Product } from "../types/product/Product";
import style from "../styles/Product.module.scss";
import SearchBox from "../components/utils/SearchBox";

const Products: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products || []);
  const currentPage = useSelector((state: RootState) => state.products.currentPage);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Product>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  useEffect(() => {
    if (products.length === 0) {
      const fetchProducts = async () => {
        const response = await axios.get("https://fakestoreapi.com/products");
        dispatch(setProducts(response.data));
      };
      fetchProducts();
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    handlePageChange(1);
  }, [categoryFilter]);

  useEffect(() => {
    if (!products) return;
    handlePageChange(1);
    setFilteredProducts(
      products
        .filter((product) => {
          const title = product.title || "";
          const category = product.category || "";
          return (
            title.toLowerCase().includes(search.toLowerCase()) &&
            (categoryFilter ? category === categoryFilter : true)
          );
        })
        .sort((a, b) => {
          if (sortColumn in a && sortColumn in b) {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (typeof aValue === "string" && typeof bValue === "string") {
              return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            if (typeof aValue === "number" && typeof bValue === "number") {
              return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
            }
          }

          return 0;
        })
    );
  }, [search, products, sortColumn, sortOrder, categoryFilter]);

  const handleSort = (column: keyof Product) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://fakestoreapi.com/products/${id}`);
      dispatch(deleteProduct(id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * 3, currentPage * 3);

  const getCategoryClass = (category: string) => {
    const classes: { [key: string]: string } = {
      electronics: style["badge-electronics"],
      jewelery: style["badge-jewelery"],
      "men's clothing": style["badge-mens-clothing"],
      "women's clothing": style["badge-womens-clothing"],
    };
    return classes[category] || "badge-secondary";
  };

  const renderPaginationItems = () => {
    const items: JSX.Element[] = [];
    const pageCount = Math.ceil(filteredProducts.length / 3);

    if (pageCount <= 1) return items;

    const maxPagesToShow = 5;
    const showPagesBefore = 2;
    const showPagesAfter = 2;

    let startPage = Math.max(1, currentPage - showPagesBefore);
    let endPage = Math.min(pageCount, currentPage + showPagesAfter);
    if (endPage - startPage + 1 < maxPagesToShow) {
      if (currentPage < pageCount / 2) {
        endPage = Math.min(pageCount, startPage + maxPagesToShow - 1);
      } else {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
    }

    if (startPage > 1) {
      items.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
          {page}
        </Pagination.Item>
      );
    }
    if (endPage < pageCount) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" />);
    }

    return items;
  };

  return (
    <Container className={style.container}>
      <div className="d-flex justify-content-between">
        <SearchBox setSearch={setSearch} search={search}></SearchBox>
        <div className="d-flex">
          <Dropdown className="mb-3 mr-3">
            <Dropdown.Toggle variant="success" id="dropdown-basic" className={style.filterButton}>
              {categoryFilter || "All Categories"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setCategoryFilter("")}>All Categories</Dropdown.Item>
              {[...new Set(products.map((product) => product.category))].map((category) => (
                <Dropdown.Item key={category} onClick={() => setCategoryFilter(category)}>
                  <div className={`${style.badge} ${getCategoryClass(category)}`}>{category}</div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <div className="d-flex justify-content-between mb-3">
            <Button variant="primary" as="div" className={style.addButton}>
              <Link to="/products/create" className="text-decoration-none">
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Table striped bordered hover className={`mt-5 ${style.table}`}>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              ID {sortColumn === "id" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("title")}>
              Title {sortColumn === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("price")}>
              Price {sortColumn === "price" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("category")}>
              Category {sortColumn === "category" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>
                <div className={`${style.badge} ${getCategoryClass(product.category)}`}>
                  {product.category}
                </div>
              </td>
              <td>
                <Dropdown className="d-inline">
                  <Dropdown.Toggle variant="link" id="dropdown-custom-components">
                    <span className="text-muted">⋯</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/products/${product.id}?mode=view`}>
                      View
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={`/products/${product.id}?mode=edit`}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(product.id)}>Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>{renderPaginationItems()}</Pagination>
    </Container>
  );
};

export default Products;
