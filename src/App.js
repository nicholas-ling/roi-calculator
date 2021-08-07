import React from "react";
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

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds }
  } = useTable(
    {
      columns,
      data
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          )
        },
        ...columns
      ]);
    }
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
      <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
      <pre>
        <code>
          {JSON.stringify(
            {
              selectedRowIds: selectedRowIds,
              "selectedFlatRows[].original": selectedFlatRows.map(
                (d) => d.original
              )
            },
            null,
            2
          )}
        </code>
      </pre>
    </>
  );
}

function App() {
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
            Header: "投资回报率",
            accessor: "roi"
          }
        ]
      }
    ],
    []
  );

  const data = React.useMemo(() => makeData(40), []);

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;
