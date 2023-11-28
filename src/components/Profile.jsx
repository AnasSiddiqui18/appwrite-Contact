import { database } from "../appwrite/appwriteConfig";
import { useCallback, useEffect, useState } from "react";
import conf from "../conf/conf";
import { useLocation } from "react-router-dom";
import { Query } from "appwrite";
import { useForm } from "react-hook-form";

const Profile = () => {
  const [contactlist, setContactList] = useState([]);
  const [updatemode, setUpdateMode] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const location = useLocation();

  const response = location && location.state && location.state.userId;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (updatemode) {
      updateDatabase(data);
    } else {
      createDocument(data);
    }
  };

  const createDocument = async (data) => {
    try {
      const res = await database.createDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        "unique()",
        {
          name: data.name,
          number: data.number,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateDatabase = async (data) => {
    try {
      const res = await database.updateDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        documentId,
        {
          name: data.name,
          number: data.number,
        }
      );
      listDocument();
      reset();
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
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <input
            {...register("name", {
              required: "Name Is Required!",
            })}
            type="text"
            name="name"
            className="outline-none px-3 py-1 rounded-md w-full"
            placeholder="Enter Name Here"
          />

          {errors.number && (
            <p className="text-red-500">{errors.number.message}</p>
          )}

          <input
            {...register("number", {
              required: "Number Is Required!",
            })}
            type="text"
            name="number"
            className="outline-none px-3 py-1 rounded-md w-full"
            placeholder="Enter Contact Number"
          />

          <span className="flex justify-between mt-2">
            {!updatemode ? (
              <button
                className="bg-orange-600 text-white px-1 rounded-md"
                type="submit"
              >
                Create
              </button>
            ) : (
              <button
                className="bg-orange-600 text-white px-1 rounded-md"
                type="submit"
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
                        setValue("name", data.name);
                        setValue("number", data.number);
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
