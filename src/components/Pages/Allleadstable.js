import React, { useState, useEffect } from "react";

import axios from "axios";
import DataTable from "react-data-table-component";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import {getAllAgent, getAllAgentWithData} from "../../features/agentSlice";
import { getAllStatus } from "../../features/statusSlice";
import { toast } from "react-toastify";
// import ReactHTMLTableToExcel from 'react-html-table-to-excel'; // Import the library

export const Allleadstable = ({ sendDataToParent, dataFromParent }) => {
  const dispatch = useDispatch();
  const [leads, setleads] = useState([]);
  const [status, setstatus] = useState('true');
  const [search, setsearch] = useState("");
  const [filterleads, setfilterleads] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const { agent } = useSelector((state) => state.agent); 
  const { Statusdata } = useSelector((state) => state.StatusData);
  const apiUrl = process.env.REACT_APP_API_URL;
  const DBuUrl = process.env.REACT_APP_DB_URL;
  console.log('status',status)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
       // dispatch(getAllAgent());
        dispatch(getAllStatus());

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const getAllLead1 = async () => {
    try {
      const responce = await axios.get(
        `${apiUrl}/get_all_lead`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        },
      }
      );
      setstatus(responce?.data?.success);
      setleads(responce?.data?.lead);
      setfilterleads(responce?.data?.lead);
      return (responce?.data?.message);
    } catch (error) {
      const message = await error?.response?.data?.message;
      if (message == 'Client must be connected before running operations') {
        getAllLead1();
      }
      console.log(error);
      setfilterleads();
    }
  };

  const getAllLead2 = async (assign_to_agent) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/get_Leadby_agentid_with_status`,
        {
          assign_to_agent,
        },
      );
      setstatus(responce?.data?.success);
      if (responce?.data?.success === true) {
        setstatus(responce?.data?.success);
        setleads(responce?.data?.lead);
        setfilterleads(responce?.data?.lead);
      }
      if (responce?.data?.success === false) {
        setstatus(responce?.data?.success);
        setleads(responce?.data?.lead);
        setfilterleads(responce?.data?.lead);
      }
    } catch (error) {
      const message = await error?.response?.data?.message;
      if (message == 'Client must be connected before running operations') {
        getAllLead2();
      }
      console.log(error);
      setfilterleads();
    }
  };
  /////// For Team Leader
  const getAllLead3 = async (assign_to_agent) => {
    try { 
      const responce = await axios.post(
        `${apiUrl}/getLeadbyTeamLeaderidandwithstatus`,
        {
          assign_to_agent,
        },
      );
      setstatus(responce?.data?.success);
      if (responce?.data?.success === true) {   
        setleads(responce?.data?.lead);
      setfilterleads(responce?.data?.lead);
      return (responce?.data?.message);
      }
      
    } catch (error) {
      const message = await error?.response?.data?.message;
      if (message == 'Client must be connected before running operations') {
        getAllLead3();
      }
      console.log(error);
      setfilterleads();
    }
  };

  useEffect(() => {
    if (localStorage.getItem("role") === "admin") {
      getAllLead1();
      dispatch(getAllAgent()); 
    }
    if (localStorage.getItem("role") === "TeamLeader") {
      getAllLead3(localStorage.getItem("user_id"));
        dispatch(getAllAgentWithData({assign_to_agent:localStorage.getItem("user_id")}));
      } 
    else {
      getAllLead2(localStorage.getItem("user_id"));
      dispatch(getAllAgent({assign_to_agent:localStorage.getItem("user_id")}));
    }
  }, [localStorage.getItem("user_id"), apiUrl, DBuUrl,localStorage.getItem("role")]);

  useEffect(() => {
    const result = leads.filter((lead) => {
      return (
        lead.full_name.toLowerCase().match(search.toLowerCase()) ||
        lead?.agent_details[0]?.agent_name
          .toLowerCase()
          .match(search.toLowerCase()) ||
        lead?.service_details[0]?.product_service_name
          .toLowerCase()
          .match(search.toLowerCase()) ||
        lead?.lead_source_details[0]?.lead_source_name
          .toLowerCase()
          .match(search.toLowerCase()) ||
        lead?.status_details[0]?.status_name
          .toLowerCase()
          .match(search.toLowerCase())
      );
    });
    setfilterleads(result);
  }, [search]);
  const isAdmin = localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "TeamLeader";
  const isAdmin1 = localStorage.getItem("role") === "admin";
  const commonColumns = [
    {
      name: "Name",
      cell: (row) => (
        <a href={`/followupleads/${row?._id}`}>{row?.full_name}</a>
      ),
      selector: (row) => row?.full_name,
      sortable: true,
    },
    {
      name: "Number",
      selector: (row) => row?.contact_no,
      sortable: true,
    },

  ];

  const getStatusBadgeClass = (statusName) => {
    switch (statusName) {
      case "Call Back & Hot Lead": {
        return "bg-danger";
      }
      case "Meeting": {
        return "bg-success";
      }
      case "Call Back": {
        return "bg-warning text-dark";
      }

      default:
        return "bg-default"; // Default class for other statuses
    }
  };

  const adminColumns = [
    {
      name: "Agent",
      selector: (row) => row?.agent_details[0]?.agent_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.status_details[0]?.status_name,

      sortable: true,
    },
    {
      name: "Service",
      selector: (row) => row?.service_details[0]?.product_service_name,
      sortable: true,
    },
    {
      name: <div style={{ display: 'none' }}>
        Last Comment
      </div>,
      selector: (row) => row?.description,
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'none' }}>
          {row.description}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <a href={`/followupleads/${row?._id}`}>
          <button className="btn btn-success btn-sm"><i className="fa fa-pencil-square" aria-hidden="true"></i></button>
          <span
            className={`badge ${getStatusBadgeClass(
              row?.status_details[0]?.status_name
            )}`}
            style={{ marginLeft: "10px" }}
          >
            {row?.status_details[0]?.status_name == "Call Back & Hot Lead"
              ? "Hot"
              : row?.status_details[0]?.status_name == "Call Back"
                ? "C"
                : row?.status_details[0]?.status_name == "Meeting"
                  ? "M"
                  : ""}
          </span>
        </a>
      ),

      sortable: true,
    },
  ];

  const userColumns = [
    {
      name: "Status",
      selector: (row) => row?.status_details[0]?.status_name,
      sortable: true,
    },
    {
      name: "Service",
      selector: (row) => row?.service_details[0]?.product_service_name,
      sortable: true,
    },
    {
      name: <div style={{ display: 'none' }}>
        Last Comment
      </div>,
      selector: (row) => row?.description,
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'none' }}>
          {row.description}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <a href={`/followupleads/${row?._id}`}>
          <button className="btn btn-success"><i className="fa fa-pencil-square" aria-hidden="true"></i></button>
          <span
            className={`badge ${getStatusBadgeClass(
              row?.status_details[0]?.status_name
            )}`}
            style={{ marginLeft: "10px" }}
          >
            {row?.status_details[0]?.status_name == "Call Back & Hot Lead"
              ? "Hot"
              : row?.status_details[0]?.status_name == "Call Back"
                ? "C"
                : row?.status_details[0]?.status_name == "Meeting"
                  ? "M"
                  : ""}
          </span>
        </a>
      ),
      sortable: true,
    },
  ];

  const columns = isAdmin
    ? [...commonColumns, ...adminColumns]
    : [...commonColumns, ...userColumns];

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableDataForPDF = filterleads.map((row) =>
      columns.map((column) => {
        if (column.selector && typeof column.selector === "function") {
          return column.selector(row);
        }
        return row[column.selector];
      })
    );
    doc.autoTable({
      head: [columns.map((column) => column.name)],
      body: tableDataForPDF,
    });
    doc.save("table.pdf");
  };

  const customStyles = {
    cells: {
      style: {
        border: "0px solid #ddd", // Set the cell border
        fontSize: "14px",
        // background: "#f4f3fe",
      },
    },
    headCells: {
      style: {
        border: "0px solid #111", // Set the header cell border
        fontSize: "14px",
        background: "#f0f0f0",
      },
    },
    rows: {
      style: {
        background: "#fdf1f1", // Set the default background color
      },
    },
    highlightOnHover: {
      style: {
        background: "#f4f3fe", // Set the background color on hover
      },
    },
    striped: {
      style: {
        background: "#f8f9fa", // Set the background color for striped rows
      },
    },
    // Hide the Last Comment column
    // rows: {
    //   style: {
    //     display: "none",
    //   },
    // },
  };

  const handleSelectedRowsChange = ({ selectedRows }) => {
    const selectedIds = selectedRows.map((row) => row._id);
    setSelectedRowIds(selectedIds);
    sendDataToParent(selectedIds);
  };
  const [adSerch, setAdvanceSerch] = useState([]);

  const DeleteSelected = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (confirmDelete) {
      const aaaaa = { ids: selectedRowIds };

      fetch(`${apiUrl}/BulkDeleteLead`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        },
        body: JSON.stringify(aaaaa),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data?.success == true) {
            toast.success(data?.message);
            setTimeout(() => {
              window.location.reload(false);
            }, 500);
          } else {
            toast.warn(data?.message);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      console.log("Item deleted!");
    } else {
      toast.success("Delete canceled");
      console.log("Delete canceled");
    }
  };

  const AdvanceSerch = async (e) => {
    e.preventDefault();
     const updatedata={...adSerch,user_id:localStorage.getItem("user_id"),role:localStorage.getItem("role")}
    fetch(`${apiUrl}/getAdvanceFillter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "mongodb-url": DBuUrl,
      },
      body: JSON.stringify(updatedata),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from server:", data);
        setstatus(data?.success);
        setleads(data?.lead);
        setfilterleads(data?.lead);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle errors
      });
  };

  const exportToExcel = () => {
    const columnsForExport = columns.map((column) => ({
      title: column.name,
      dataIndex: column.selector,
    }));

    const dataForExport = filterleads.map((row) =>
      columns.map((column) => {
        if (column.selector && typeof column.selector === "function") {
          return column.selector(row);
        }
        return row[column.selector];
      })
    );

    const exportData = [
      columnsForExport.map((col) => col.title),
      ...dataForExport,
    ];
    const blob = new Blob(
      [exportData.map((row) => row.join("\t")).join("\n")],
      {
        type: "application/vnd.ms-excel",
      }
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Refresh = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
  };

  return (
    <div>
      <div className="row " style={{ display: dataFromParent }}>
        <div className="col-md-12 advS">
          <form onSubmit={AdvanceSerch}>
            <div className="row">
              <div className="col-md-3 ">
                <div className="form-group">
                  <select
                    className="form-control"
                    onChange={(e) =>
                      setAdvanceSerch({ ...adSerch, Status: e.target.value })
                    }
                    name="Status"
                  >
                    <option>Status</option>
                    {Statusdata?.leadstatus?.map((status, key) => {
                      return (
                        <option value={status._id}>{status.status_name}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <select
                    className="form-control"
                    onChange={(e) =>
                      setAdvanceSerch({ ...adSerch, agent: e.target.value })
                    }
                    name="agent"
                  >
                    <option>Agent</option>
                    <option value="Unassigne">Unassigned Agent</option>
                    {agent?.agent?.map((agents, key) => {
                      return (
                        <option value={agents._id}>{agents.agent_name}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <input
                    type="date"
                    placeholder="Date To"
                    className="form-control"
                    onChange={(e) =>
                      setAdvanceSerch({ ...adSerch, startDate: e.target.value })
                    }
                    name="startDate"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <input
                    type="date"
                    placeholder="Date Till"
                    onChange={(e) =>
                      setAdvanceSerch({ ...adSerch, endDate: e.target.value })
                    }
                    className="form-control"
                    name="endDate"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btnes btn-block btn-success form-control "
                  >
                    Submit
                  </button>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <button
                    onClick={Refresh}
                    className="btn btnes btn-block btn-success form-control "
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {status === false ? (
        <table
          id="example"
          className="table table-striped pt-3"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Agent</th>
              <th>Service</th>
              <th>Lead Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <p className="text-center">No Followup leads Founds</p>
            </tr>
          </tbody>
        </table>
      ) : (
        <>
         

          {
            isAdmin1 ? (<><button className="btn btn-sm shadow_btn btn-success" onClick={exportToPDF}>Export PDF</button>
            <button className="btn btn-sm shadow_btn btn-success" onClick={exportToExcel}>
              Export Excel
            </button>
          <button className="btn shadow_btn btn-sm btn-danger" onClick={DeleteSelected}>
            Delete
          </button></>
              ) : (<></>)
          }
          <DataTable
            responsive
            id="table-to-export"
            columns={columns}
            data={filterleads}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="550px"
            selectableRows
            selectableRowsHighlight
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                className="form-control w-25 "
              />
            }
            customStyles={customStyles}
            selectedRows={selectedRowIds}
            onSelectedRowsChange={handleSelectedRowsChange}
            striped
          />
        </>
      )}
    </div>
  );
};
