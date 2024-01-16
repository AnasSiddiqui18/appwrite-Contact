import { database } from "../appwrite/appwriteConfig";
import { useCallback, useEffect, useState } from "react";
import conf from "../conf/conf";
import { useParams } from "react-router-dom";
import { Query } from "appwrite";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useUser } from "../context/userContext";

const Profile = () => {
  const [contactlist, setContactList] = useState([]);
  const [updatemode, setUpdateMode] = useState(false);
  const [documentId, setDocumentId] = useState("");

  const { id: response } = useParams();

  const schema = yup.object().shape({
    name: yup
      .string("Should be in string")
      .min(4, "Name must be atleast 4 characters long"),
    number: yup
      .string("Should be in string")
      .max(15, "Maximum 15 characters is allowed for the number")
      .min(7, "number must be atleast 7 characters long"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
        "6546bcb5d7292998afaf",
        "6546bcc0e8f8826ef025",
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
      console.log(`Error while creating the document`, error);
    }
  };

  const listDocument = useCallback(async () => {
    try {
      const { documents } = await database.listDocuments(
        "6546bcb5d7292998afaf",
        "6546bcc0e8f8826ef025",
        [Query.equal("id", response)]
      );

      setContactList(documents);
    } catch (error) {
      console.log(`Error while listing the contacts`, error);
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

  const reversedItems = contactlist.slice().reverse();

  return (
    <div className="h-[calc(100vh-48px)] bg-gray-400 flex flex-col items-center justify-center">
      <div className="w-[500px] h-[400px] bg-orange-400 rounded-lg px-4 py-4 mt-[70px] flex gap-2 flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-y-3 flex-col"
        >
          <p className="text-red-500">{errors.name?.message}</p>
          <input
            {...register("name")}
            type="text"
            className="outline-none px-3 py-1 rounded-md w-full"
            placeholder="Enter Name Here"
          />
          <p className="text-red-500">{errors.number?.message}</p>
          <input
            {...register("number")}
            type="number"
            className="outline-none px-3 py-1 rounded-md w-full "
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
          {reversedItems.map((data, i) => (
            <div key={i} className="flex items-center w-full gap-2 ">
              <div className="bg-gray-200 px-3 py-2 rounded-md w-full mr-2">
                <span className="font-semibold uppercase">{data.name}</span>
                <div className="flex justify-between">
                  {data.number}
                  <span className="flex gap-3">
                    <button
                      onClick={() => {
                        setValue("name", data.name);
                        setValue("number", data.number);
                        setUpdateMode(true);
                        setDocumentId(data.$id);
                      }}
                      className="cursor-pointer bg-[crimson] text-white px-2 rounded-md"
                    >
                      Update
                    </button>
                    <button
                      onClick={(event) => {
                        deleteDocument(data.$id);
                        event.target.disabled = "true";
                      }}
                      className="cursor-pointer bg-orange-600 disabled:opacity-60 disabled:pointer-events-none text-white px-2 rounded-md"
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
