import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { Card, Typography, Button } from "@material-tailwind/react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import {
  getClasses,
  addClass,
  updateClass,
  deleteClass,
} from "../../redux/action/classesActions";
import baseUrl from "../../api/api";

const ClassesTable = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.allClasses);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState({
    classId: null,
    name: "",
    gradeLevelId: "",
    schoolId: "",
    ClassSubjectTeachers: [{ subjectId: "", teacherId: "" }],
  });
  const [isEditing, setIsEditing] = useState(false);

  const [allSchools, setAllSchools] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [allGradeLevels, setAllGradeLevels] = useState([]); 

  useEffect(() => {
    dispatch(getClasses());
    fetchSchools();
    fetchSubjects();
    fetchTeachers();
    fetchGradeLevels(); 
  }, [dispatch]);

  const fetchSchools = async () => {
    try {
      const response = await baseUrl.get("/api/schools");
      setAllSchools(response.data);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب المدارس:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await baseUrl.get("/api/subjects");
      setAllSubjects(response.data);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب المواد:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await baseUrl.get("/api/teachers");
      setAllTeachers(response.data);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب المدرسين:", error);
    }
  };

  const fetchGradeLevels = async () => {
    try {
      const response = await baseUrl.get("/api/gradelevel");
      setAllGradeLevels(response.data);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب المراحل الدراسية:", error);
    }
  };

  const handleEdit = (classId) => {
    const cls = classes.find((c) => c.classId === classId);
    if (cls) {
      setCurrentClass(cls);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentClass({
      classId: null,
      name: "",
      gradeLevelId: "",
      schoolId: "",
      ClassSubjectTeachers: [{ subjectId: "", teacherId: "" }],
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        name: currentClass.name,
        gradeLevelId: currentClass.gradeLevelId,
        schoolId: currentClass.schoolId,
        ClassSubjectTeachers: currentClass.ClassSubjectTeachers,
        classId: currentClass.classId,
      };

      if (isEditing) {
        await baseUrl.put(`/api/classes/${currentClass.classId}`, dataToSend);
        dispatch(updateClass({ ...dataToSend, classId: currentClass.classId }));
      } else {
        await baseUrl.post(`/api/classes`, dataToSend);
      }

      dispatch(getClasses());
      closeModal();
    } catch (error) {
      console.error(
        "حدث خطأ أثناء حفظ الصف:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDelete = async (classId) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذه الشعبة؟");
    if (confirmed) {
      try {
        await baseUrl.delete(`/api/classes/${classId}`);
        dispatch(deleteClass(classId));
      } catch (error) {
        console.error("حدث خطأ أثناء حذف الشعبة:", error);
      }
    }
  };

  const handleAddRow = () => {
    setCurrentClass((prev) => ({
      ...prev,
      ClassSubjectTeachers: [
        ...prev.ClassSubjectTeachers,
        { subjectId: "", teacherId: "" },
      ],
    }));
  };

  const handleRemoveRow = (index) => {
    const updatedRows = currentClass.ClassSubjectTeachers.filter(
      (_, i) => i !== index
    );
    setCurrentClass((prev) => ({
      ...prev,
      ClassSubjectTeachers: updatedRows,
    }));
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = currentClass.ClassSubjectTeachers.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setCurrentClass((prev) => ({
      ...prev,
      ClassSubjectTeachers: updatedRows,
    }));
  };

  const TABLE_HEAD = ["الشعبة", "المرحلة الدراسية", "الإجراءات"];

  return (
    <div className="mx-[25px] mt-[25px] w-[250%] ">
      <div className="flex justify-between items-center p-4 font-almarai">
        <h2 className="font-bold">قائمة الشعب والمراحل الدراسية</h2>
        <Button
          className="flex items-center gap-2 bg-[#4e73df]"
          onClick={() => setIsModalOpen(true)}
        >
          <span>إضافة شعبة</span>
          <FaPlus className="h-5 w-3" />
        </Button>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel={isEditing ? "تعديل الشعبة" : "إضافة شعبة"}
          className="bg-white p-8 rounded-md shadow-lg w-1/2 mx-auto my-20 font-almarai"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold mb-4">
            {isEditing ? "تعديل الشعبة" : "إضافة شعبة"}
          </h2>
          <div>
            <label>اسم الشعبة:</label>
            <input
              type="text"
              className="border p-2 w-full rounded-md"
              value={currentClass.name}
              onChange={(e) =>
                setCurrentClass({ ...currentClass, name: e.target.value })
              }
            />
          </div>
          <div className="mt-4">
            <label>المدرسة:</label>
            <select
              className="border p-2 pr-9 w-full rounded-md"
              value={currentClass.schoolId}
              onChange={(e) =>
                setCurrentClass({ ...currentClass, schoolId: e.target.value })
              }
            >
              <option value="" className="">اختر المدرسة</option>
              {allSchools.map((school) => (
                <option key={school.schoolId} value={school.schoolId}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label>المرحلة الدراسية:</label>
            <select
              className="border p-2 w-full rounded-md pr-9"
              value={currentClass.gradeLevelId}
              onChange={(e) =>
                setCurrentClass({
                  ...currentClass,
                  gradeLevelId: e.target.value,
                })
              }
            >
              <option value="">اختر المرحلة الدراسية</option>
              {allGradeLevels.map((level) => (
                <option key={level.gradeLevelId} value={level.gradeLevelId}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label>المواد والمدرسين:</label>
            {currentClass.ClassSubjectTeachers.map((row, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <select
                  className="border p-2 w-full rounded-md pr-9"
                  value={row.subjectId}
                  onChange={(e) =>
                    handleRowChange(index, "subjectId", e.target.value)
                  }
                >
                  <option value="">اختر المادة</option>
                  {allSubjects.map((subject) => (
                    <option key={subject.subjectId} value={subject.subjectId}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <select
                  className="border p-2 w-full rounded-md pr-9"
                  value={row.teacherId}
                  onChange={(e) =>
                    handleRowChange(index, "teacherId", e.target.value)
                  }
                >
                  <option value="">اختر الأستاذ</option>
                  {allTeachers.map((teacher) => (
                    <option key={teacher.teacherId} value={teacher.teacherId}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                <Button
                  className="bg-red-600"
                  onClick={() => handleRemoveRow(index)}
                >
                  <FaTimes />
                </Button>
              </div>
            ))}
            <Button className="bg-green-600" onClick={handleAddRow}>
              <FaPlus /> إضافة صف
            </Button>
          </div>

          <div className="flex justify-between mt-4 ">
            <Button className="bg-[#4e73df]" onClick={handleSave}>
              {isEditing ? "حفظ التعديلات" : "إضافة شعبة"}
            </Button>
            <Button onClick={closeModal} className="mr-2 bg-red-600">
              إلغاء
            </Button>
          </div>
        </Modal>
      </div>
      <Card className="h-full w-full">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-center"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classes.map(({ classId, name, gradeLevel }, index) => {
              const isLast = index === classes.length - 1;
              const rowClasses = isLast
                ? "p-4 text-center align-middle"
                : "p-4 border-b border-blue-gray-50 text-center align-middle";

              return (
                <tr key={classId} className="align-middle">
                  <td className={rowClasses}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {name}
                    </Typography>
                  </td>
                  <td className={rowClasses}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {gradeLevel?.levelName || "غير متاح"}
                    </Typography>
                  </td>
                  <td className={rowClasses}>
                    <Button onClick={() => handleEdit(classId)} className="mr-2">
                      <FaEdit className="h-5 w-5 text-blue-600" />
                    </Button>
                    <Button onClick={() => handleDelete(classId)}>
                      <FaTrash className="h-5 w-5 text-red-600" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default ClassesTable;
