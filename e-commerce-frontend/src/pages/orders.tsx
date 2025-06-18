import { useState, type ReactElement } from "react";
import TableHOC from "../components/admin/TableHOC"
import type { Column } from "react-table";
import { Link } from "react-router-dom";

type DataType = {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
}
const column: Column<DataType>[] = [
    {
        Header: "ID",
        accessor: "_id",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    {
        Header: "Action",
        accessor: "action",
    },
]

const Orders = () => {
    const [rows, setRows] = useState<DataType[]>([
        {
            _id: "fjafdjaldfjaljd",
            amount: 1000,
            quantity: 2,
            discount: 100,
            status: <span className="red">Processing</span>,
            action: <Link to={`/order/${"fjafdjaldfjaljd"}`} >View</Link>
        }

    ])
    const Table = TableHOC<DataType>(column, rows, "dashboard-product-box", "Orders", rows.length > 6)();
    return (
        <div className="container" >
            <h1>My Orders</h1>
            {
                Table
            }

        </div>
    )
}

export default Orders
