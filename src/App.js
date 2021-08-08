import React, { useState } from "react";
import styled from "styled-components";
import { useTable, useRowSelect } from "react-table";
import makeData from "./makeData";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useRowSelect
  );

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.slice(0, 50).map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function App() {
  const rows = 40;
  const [data, setData] = useState(makeData(rows, 123));

  const columns = React.useMemo(
    () => [
      {
        Header: "房价",
        accessor: "price"
      },
      {
        Header: "首付",
        accessor: "down"
      },
      {
        Header: "每月支出",
        columns: [
          {
            Header: "贷款月供",
            accessor: "mortgage"
          },
          {
            Header: "维护费",
            accessor: "management"
          },
          {
            Header: "地税",
            accessor: "tax"
          },
          {
            Header: "房东保险",
            accessor: "insurance"
          }
        ]
      },
      {
        Header: "每月收入",
        columns: [
          {
            Header: "租金",
            accessor: "rental"
          }
        ]
      },
      {
        Header: "财务分析",
        columns: [
          {
            Header: "每月现金流",
            accessor: "cash"
          },
          {
            Header: "每月收益流",
            accessor: "profit"
          },
          {
            Header: "租金年化复合回报",
            accessor: "roi"
          }
        ]
      }
    ],
    []
  );

  const [management, setManagement] = useState(0);
  const updateManagement = (e) => {
    setManagement(e.target.value);
    setData(makeData(rows, e.target.value, tax, rental));
  };
  const [tax, setTax] = useState(0);
  const updateTax = (e) => {
    setTax(e.target.value);
    setData(makeData(rows, management, e.target.value, rental));
  };
  const [rental, setRental] = useState(0);
  const updateRental = (e) => {
    setRental(e.target.value);
    setData(makeData(rows, management, tax, e.target.value));
  };

  return (
    <Styles>
      <div>
        <h1>加拿大Condo投资收益计算</h1>
        <p>condo投资利器，贷款按80%，30年1.28%利率，土地装让税目前暂不支持</p>
        <p>有任何建议/问题欢迎联系Nic，邮箱mercurywin@gmail.com，持续更新</p>
        <p>
          管理费/月：
          <input type="number" name="management" onChange={updateManagement} />
          {"  "}
        </p>
        <p>
          土地税/年：
          <input type="number" name="tax" onChange={updateTax} />
          {"  "}
        </p>
        <p>
          月租金/月：
          <input type="number" name="rental" onChange={updateRental} />
          {"  "}
        </p>
      </div>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;
