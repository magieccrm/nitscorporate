import React, { useState, useEffect } from "react";

import axios from "axios";
import DataTable from "react-data-table-component";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import {getAllAgent, getAllAgentWithData} from "../../features/agentSlice";
import { getAllStatus } from "../../features/statusSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
// import ReactHTMLTableToExcel from 'react-html-table-to-excel'; // Import the library

export const ScheduleEvent = ({ sendDataToParent, dataFromParent }) => {
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
  const {id} = useParams();
  const getLeadbyScheduleEventid = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/getLeadbyScheduleEventid`,
        {
          assign_to_agent:localStorage.getItem("user_id"),role:localStorage.getItem("role"),status_id:id,
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
     
      console.log(error);
      setfilterleads();
    }
  };
  
  useEffect(() => {
    getLeadbyScheduleEventid();
  }, [localStorage.getItem("user_id"), apiUrl, DBuUrl,localStorage.getItem("role"),id]);

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
  
  };


  

  

 

  return (
    <div>
      <div className="row " style={{ display: dataFromParent }}>
       
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
            // subHeaderComponent={
            //   <input
            //     type="text"
            //     placeholder="Search here"
            //     value={search}
            //     onChange={(e) => setsearch(e.target.value)}
            //     className="form-control w-25 "
            //   />
            // }
            customStyles={customStyles}
            // selectedRows={selectedRowIds}
            // onSelectedRowsChange={handleSelectedRowsChange}
            striped
          />
        </>
      )}
    </div>
  );
};
