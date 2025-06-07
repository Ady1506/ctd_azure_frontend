// src/components/UpdateCourseModal.jsx
import React, { useState, useEffect } from 'react';

// No longer needed: import _isEqual from 'lodash/isEqual';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const API_BASE_URL = `${backendUrl}/api`;

// --- Helper functions (keep formatTimeToAmPm, formatTimeToHHMM, getPeriodFromHHMM, formatDateToInput) ---
const formatTimeToAmPm = (timeString_HHMM) => {
  if (!timeString_HHMM) return '';
  const [hoursStr, minutesStr] = timeString_HHMM.split(':');
  if (hoursStr === undefined || minutesStr === undefined) return '';
  let H = parseInt(hoursStr, 10);
  const M = minutesStr;
  const ampm = H >= 12 ? 'PM' : 'AM';
  H = H % 12;
  H = H ? H : 12;
  const paddedMinute = String(M).padStart(2, '0');
  return `${H}:${paddedMinute} ${ampm}`;
};

const formatTimeToHHMM = (timeString) => {
    if (!timeString) return '';
    try {
        const date = new Date(`1970-01-01T${timeString}`);
        if (!isNaN(date.getTime())) {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    } catch (e) {}
    const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const period = match[3].toUpperCase();
        if (period === 'PM' && hours !== 12) hours += 12;
        else if (period === 'AM' && hours === 12) hours = 0;
        return `${String(hours).padStart(2, '0')}:${minutes}`;
    }
    console.warn("Could not format time to HH:MM:", timeString);
    return '';
};

const getPeriodFromHHMM = (timeString_HHMM) => {
    if (!timeString_HHMM) return 'AM';
    const [hoursStr] = timeString_HHMM.split(':');
    if (hoursStr === undefined) return 'AM';
    const hours = parseInt(hoursStr, 10);
    return hours >= 12 ? 'PM' : 'AM';
};

const formatDateToInput = (isoDateString) => {
  if (!isoDateString) return '';
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset*60*1000));
    return adjustedDate.toISOString().split('T')[0];
  } catch (e) {
    console.error("Error formatting date for input:", e);
    return '';
  }
};
// --- End Helper Functions ---

const UpdateCourseModal = ({ isOpen, onClose, courseToUpdate, onCourseUpdated }) => {

  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  // No longer needed: const initialSnapshot = useRef(null);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const ampmOptions = ['AM', 'PM'];

  // --- Effect to populate form ---
  useEffect(() => {
    if (courseToUpdate) {
      const startTimeHHMM = formatTimeToHHMM(courseToUpdate.schedule?.start_time);
      const endTimeHHMM = formatTimeToHHMM(courseToUpdate.schedule?.end_time);

      setFormData({
        name: courseToUpdate.name || '',
        subject: courseToUpdate.subject || '',
        description: courseToUpdate.description || '',
        schedule: {
          days: courseToUpdate.schedule?.days || [],
          start_time: startTimeHHMM,
          start_period: getPeriodFromHHMM(startTimeHHMM) || 'AM',
          end_time: endTimeHHMM,
          end_period: getPeriodFromHHMM(endTimeHHMM) || 'AM',
        },
        duration_weeks: courseToUpdate.duration_weeks || '',
        meeting_link: courseToUpdate.meeting_link || '',
        link: courseToUpdate.link || '',
        start_date: formatDateToInput(courseToUpdate.start_date),
        end_date: formatDateToInput(courseToUpdate.end_date),
      });
      // No longer needed: initialSnapshot.current = JSON.parse(JSON.stringify(initialData));
      setError(null);
      setSuccessMessage('');
    } else {
      setFormData(null);
      // No longer needed: initialSnapshot.current = null;
    }
  }, [courseToUpdate]);

  // --- Standard handleChange (remains the same) ---
  const handleChange = (e) => {
    if (!formData) return;
    const { name, value, type, checked } = e.target;
    setError(null);
    setSuccessMessage('');
    const isScheduleField = ['days', 'start_time', 'start_period', 'end_time', 'end_period'].includes(name);

    if (isScheduleField) {
      setFormData((prev) => {
        const newSchedule = { ...prev.schedule };
        if (name === 'days') {
          newSchedule.days = checked
            ? [...prev.schedule.days, value]
            : prev.schedule.days.filter((day) => day !== value);
        } else {
          newSchedule[name] = value;
        }
        return { ...prev, schedule: newSchedule };
      });
    } else if (name === 'start_date' || name === 'end_date') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (name === 'duration_weeks') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? '' : parseInt(value, 10) || 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- handleSubmit sending FULL payload ---
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData || !courseToUpdate?.id) {
      setError("Cannot update: Course data is missing.");
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');
  
    // Basic validation
    if (!formData.name || !formData.subject) {
      setError('Course Name and Subject are required.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.schedule.start_time || !formData.schedule.end_time) {
      setError('Please select both start and end times.');
      setIsSubmitting(false);
      return;
    }
  
    // Format time back to h:mm A for the backend payload
    const formattedStartTime = formatTimeToAmPm(formData.schedule.start_time);
    const formattedEndTime = formatTimeToAmPm(formData.schedule.end_time);
  
    if (!formattedStartTime || !formattedEndTime) {
      setError('Invalid time value selected. Please re-select times.');
      setIsSubmitting(false);
      return;
    }
  
    const payload = {
      name: formData.name,
      subject: formData.subject,
      description: formData.description,
      duration_weeks: Number(formData.duration_weeks) || 0,
      meeting_link: formData.meeting_link,
      link: formData.link,
      schedule: {
        days: formData.schedule.days || [],
        start_time: formattedStartTime,
        end_time: formattedEndTime,
      },
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
    };
  
    if (!payload.start_date) delete payload.start_date;
    if (!payload.end_date) delete payload.end_date;
  
    console.log("Sending UPDATE Payload:", JSON.stringify(payload, null, 2));
  
    try {
      const response = await fetch(`${API_BASE_URL}/courses?id=${courseToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorMsg = `Update failed: ${response.status}`;
        const responseBodyText = await response.text();
        throw new Error(`${errorMsg} - ${responseBodyText.trim()}`);
      }
  
      const successText = await response.text();
      console.log("Update success response text:", successText);
      setSuccessMessage('Course updated successfully!');
  
      if (onCourseUpdated) {
        onCourseUpdated(courseToUpdate.id);
      }
  
      // Reload the page after showing the success message
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
        window.location.reload(); // Reload the page
      }, 2000);
    } catch (err) {
      console.error('Update course failed:', err);
      setError(err.message || 'Unexpected error occurred during update.');
    } finally {
      setIsSubmitting(false);
    }
  };

   // --- JSX (No changes needed from previous version) ---
   if (!isOpen) return null;
   if (!formData) {
       return (
           <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
               <div className="bg-white p-6 rounded">Loading course data...</div>
           </div>
       );
   }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[95vh] overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out scale-95 opacity-0 animate-modal-appear"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-6">
          <h2 className="text-xl font-semibold text-dblue">Update Course Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold" aria-label="Close modal"> × </button>
        </div>

        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          {/* Course Name & Subject */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="update-name" className="block text-sm font-medium text-gray-700 mb-1">Course Name <span className="text-red-500">*</span></label>
              <input type="text" id="update-name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dblue focus:border-dblue"/>
            </div>
            <div>
              <label htmlFor="update-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
              <input type="text" id="update-subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dblue focus:border-dblue"/>
            </div>
          </div>
          {/* Description */}
          <div>
            <label htmlFor="update-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="update-description" name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dblue focus:border-dblue"></textarea>
          </div>
          {/* Schedule */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-700 px-1">Schedule</legend>
            {/* Days */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Days</label>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {daysOfWeek.map((day) => ( <div key={day} className="flex items-center"> <input type="checkbox" id={`update-day-${day}`} name="days" value={day} checked={formData.schedule.days.includes(day)} onChange={handleChange} className="h-4 w-4 text-dblue focus:ring-dblue border-gray-300 rounded"/> <label htmlFor={`update-day-${day}`} className="ml-2 block text-sm text-gray-700">{day}</label> </div> ))}
              </div>
            </div>
            {/* Times */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="update-start_time" className="block text-xs font-medium text-gray-600 mb-1">Start Time <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input type="time" id="update-start_time" name="start_time" value={formData.schedule.start_time} onChange={handleChange} required className="w-full border rounded px-2 py-1 border-gray-300 shadow-sm focus:ring-dblue focus:border-dblue"/>
                  <select name="start_period" id="update-start_period" value={formData.schedule.start_period} onChange={handleChange} className="border rounded px-2 py-1 bg-white border-gray-300 shadow-sm focus:ring-dblue focus:border-dblue"> {ampmOptions.map(p => <option key={`update-start-${p}`} value={p}>{p}</option>)} </select>
                </div>
              </div>
              <div>
                <label htmlFor="update-end_time" className="block text-xs font-medium text-gray-600 mb-1">End Time <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input type="time" id="update-end_time" name="end_time" value={formData.schedule.end_time} onChange={handleChange} required className="w-full border rounded px-2 py-1 border-gray-300 shadow-sm focus:ring-dblue focus:border-dblue"/>
                  <select name="end_period" id="update-end_period" value={formData.schedule.end_period} onChange={handleChange} className="border rounded px-2 py-1 bg-white border-gray-300 shadow-sm focus:ring-dblue focus:border-dblue"> {ampmOptions.map(p => <option key={`update-end-${p}`} value={p}>{p}</option>)} </select>
                </div>
              </div>
            </div>
          </fieldset>
          {/* Duration, Meeting Link, Image URL */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="update-duration_weeks" className="block text-sm font-medium text-gray-700 mb-1">Duration (Weeks)</label>
              <input type="number" id="update-duration_weeks" name="duration_weeks" value={formData.duration_weeks} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dblue focus:border-dblue"/>
            </div>
            <div>
              <label htmlFor="update-meeting_link" className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
              <input type="url" id="update-meeting_link" name="meeting_link" value={formData.meeting_link} onChange={handleChange} placeholder="https://example.com/meet" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dblue focus:border-dblue"/>
            </div>
            <div>
              <label htmlFor="update-link" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" id="update-link" name="link" value={formData.link} onChange={handleChange} placeholder="https://example.com/image.png" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dblue focus:border-dblue"/>
            </div>
          </div>
          {/* Start/End Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="update-start_date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" id="update-start_date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dblue focus:border-dblue"/>
            </div>
            <div>
              <label htmlFor="update-end_date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" id="update-end_date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-dblue focus:border-dblue"/>
            </div>
          </div>

          {/* Error/Success Messages */}
          {/* Make sure success message is displayed */}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}

          {/* Submission Buttons */}
          <div className="flex justify-end space-x-3 pt-5 border-t mt-6">
             <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200 text-sm disabled:opacity-50"> Cancel </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-dblue text-white rounded shadow hover:bg-blue-900 transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"> {isSubmitting ? ( <> <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Updating... </> ) : ( 'Save Changes' )} </button>
          </div>
        </form>
         <style jsx global>{` @keyframes modal-appear { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-modal-appear { animation: modal-appear 0.3s ease-out forwards; } `}</style>
      </div>
    </div>
  );
};

export default UpdateCourseModal;