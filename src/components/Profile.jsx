import { database } from "../appwrite/appwriteConfig";
import { useCallback, useEffect, useState } from "react";
import conf from "../conf/conf";
import { useLocation } from "react-router-dom";
import { Query } from "appwrite";
import { useForm } from "react-hook-form";

const Profile = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [contactlist, setContactList] = useState([]);
  const [updatemode, setUpdateMode] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const location = useLocation();
  const response = location && location.state && location.state.userId;

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    if (updatemode) {
      updateDatabase();
    } else {
      createDocument(data);
    }
  };

  const createDocument = async (data) => {
    try {
      // const { name, number } = getValues();

      const { name, number } = data;

      if (!name || !number) console.log("name and number is required!");

      const res = await database.createDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        "unique()",
        {
          name: name,
          number: number,
          id: response,
        }
      );

      listDocument();
      reset();

      if (res) console.log(`Contact Create Successfully`, res);
    } catch (error) {
      console.log(`Error while creating the document`);
    }
  };

  const listDocument = useCallback(async () => {
    try {
      const { documents } = await database.listDocuments(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        [Query.equal("id", response)]
      );

      setContactList(documents);
    } catch (error) {
      console.log(`Error while listing the contacts`);
    }
  }, [response]);

  useEffect(() => {
    listDocument();
  }, [listDocument]);

  const updateDatabase = async () => {
    try {
      // const { name, number } = getValues();

      const res = await database.updateDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        documentId,
        {
          name: name,
          number: number,
        }
      );
      listDocument();
      // reset();
      setUpdateMode(false);

      console.log(`User updated successfully`, res);
    } catch (error) {
      console.log(`Error while updating the database`, error);
    }
  };

  const deleteDocument = async (docId) => {
    try {
      const res = await database.deleteDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        docId
      );

      listDocument();
      console.log(`User deleted successfully`, res);
    } catch (error) {
      console.log(`Error while deleting the database`, error);
    }
  };

  return (
    <div className="h-[calc(100vh-48px)] bg-gray-400 flex flex-col items-center justify-center ">
      <div className="w-[500px] h-[400px] bg-orange-200 rounded-lg px-4 py-4 mt-[70px] flex gap-2 flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-y-3 flex-col"
        >
          <input
            {...register("name", {
              required: "Name Is Required!",
              onChange: (e) => {
                setName(e.target.value);
              },
            })}
            type="text"
            name="name"
            className="outline-none px-3 py-1 rounded-md w-full"
            placeholder="Enter Name Here"
            value={name}
            // onChange={(e) => setName(e.target.value)}

            // Handle input changes
          />

          <input
            {...register("number", {
              required: "Number Is Required!",
              onChange: (e) => {
                setNumber(e.target.value);
              },
            })}
            type="text"
            name="number"
            className="outline-none px-3 py-1 rounded-md w-full"
            placeholder="Enter Contact Number"
            value={number}
          />

          <span className="flex justify-between mt-2">
            {!updatemode ? (
              <button
                className="bg-orange-600 text-white px-1 rounded-md"
                onClick={createDocument}
              >
                Create
              </button>
            ) : (
              <button
                className="bg-orange-600 text-white px-1 rounded-md"
                onClick={() => updateDatabase(documentId)}
              >
                Update
              </button>
            )}
          </span>
        </form>
        <div className="overflow-auto flex flex-col w-full items-center gap-3">
          {contactlist.map((data, i) => (
            <div key={i} className="flex items-center w-full gap-2 ">
              <div className="bg-gray-200 px-3 py-2 rounded-md w-full mr-2">
                <span className="font-semibold uppercase">{data.name}</span>
                <div className="flex justify-between">
                  {data.number}
                  <span className="flex gap-3">
                    <button
                      className="cursor-pointer bg-[crimson] text-white px-2 rounded-md"
                      onClick={() => {
                        console.log("update clicks");
                        setName(data.name);
                        setNumber(data.number);
                        setUpdateMode(true);
                        setDocumentId(data.$id);
                      }}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        deleteDocument(data.$id);
                      }}
                      className="cursor-pointer bg-orange-600 text-white px-2 rounded-md"
                    >
                      Delete
                    </button>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
