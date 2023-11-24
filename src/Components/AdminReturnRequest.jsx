import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminReturnRequest = ({user}) => {
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("returning");


  const columnNames = [
    "S.No",
    "Equipment Name",
    "Student Email ID",
    "Contact",
    "Request Date",
    "Quantity",
    "Expected return Date",
    "Retuned On",
    "Action",
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
   
    try {
      const response = await fetch(
        `http://localhost:3000/api/transaction/requests/${selectedStatus}/${user.lab}`
      );
      const data = await response.json();

      const requestsArray = data.Rrequests || [];
      const studentsArray = data.students || [];
      const equipmentsArray = data.equipments || [];

      const requestDataArray = requestsArray.map((request, index) => {
        return {
          request: requestsArray[index] || {},
          student: studentsArray[index] || {},
          equipment: equipmentsArray[index] || {},
        };
      });

      setRequests(requestDataArray);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const acceptAlert = (requestID) => {
    Swal.fire({
      title: "Accept the request?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Accept",
    }).then((result) => {
      if (result.isConfirmed) {
        acceptRequest(requestID);
      }
    });
  };

  const acceptRequest = async (requestID) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/transaction/accept/${requestID}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        throw new Error(errorData.error);
      }

      fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const declineRequest = async (requestID) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/transaction/decline/${requestID}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        throw new Error(errorData.error);
      }

      fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const declineAlert = (requestID) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this decline!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Decline The Request",
    }).then((result) => {
      if (result.isConfirmed) {
        declineRequest(requestID);
      }
    });
  };

  const renderHeader = () => {
    return (
      <tr className="bg-[#3dafaa] text-white">
        {columnNames.map((columnName, index) => (
          <th className="border p-2 text-center" key={index}>
            {columnName}
          </th>
        ))}
      </tr>
    );
  };

  const renderRow = (requestData, index) => {
    const { equipment, student, request } = requestData;

    return (
      <tr key={index}>
        <td className="border p-2 text-center">{index + 1}</td>
        <td className="border p-2 text-center">{equipment?.name}</td>
        <td className="border p-2 text-center">{student?.email}</td>
        <td className="border p-2 text-center">{student?.contactNumber}</td>
        <td className="border p-2 text-center">{request?.startDate}</td>
        <td className="border p-2 text-center">{request?.quantity}</td>
        <td className="border p-2 text-center">{request?.returnDate}</td>
        <td className="border p-2 text-center">{request?.returnedOn}</td>
        <td className="border p-2">
          <div className="flex justify-between">
            <button
              className="bg-green-500 text-white px-2 py-1 rounded-md items-center"
              onClick={() => acceptAlert(request._id)}
            >
              Approve
            </button>

            <button
              className="bg-red-500 text-white px-2 py-1 rounded-md items-center"
              onClick={() => declineAlert(request._id)}
            >
              Decline
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <h2>Admin Borrow Request</h2>
      <label htmlFor="status">Select Status:</label>
      <select
        id="status"
        className="ml-2 p-2 border border-gray-300 rounded"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="returning">Returning</option>
        <option value="completed">Completed</option>
      
      </select>
      <table className="w-full overflow-auto">
        <thead>{renderHeader()}</thead>
        <tbody>
          {requests.map((requestData, index) => renderRow(requestData, index))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReturnRequest;
