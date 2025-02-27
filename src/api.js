// import axios from 'axios';

// export const addImage = async (imageFile, metadata) => {
//   const formData = new FormData();
//   formData.append('image', imageFile);
//   formData.append('metadata', JSON.stringify(metadata));

//   try {
//     const response = await axios.post('/api/images', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const addResult = async (resultFile, metadata) => {
//   const formData = new FormData();
//   formData.append('result', resultFile);
//   formData.append('metadata', JSON.stringify(metadata));

//   try {
//     const response = await axios.post('/api/results', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const addSyllabus = async (syllabusFile, metadata) => {
//   const formData = new FormData();
//   formData.append('syllabus', syllabusFile);
//   formData.append('metadata', JSON.stringify(metadata));

//   try {
//     const response = await axios.post('/api/syllabus', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const addEvent = async (eventFile, metadata) => {
//   const formData = new FormData();
//   formData.append('event', eventFile);
//   formData.append('metadata', JSON.stringify(metadata));

//   try {
//     const response = await axios.post('/api/events', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// ../api.js
import axios from 'axios';

export const addImage = async (imageFile, metadata) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('metadata', JSON.stringify(metadata));

  try {
    const response = await axios.post('http://your-server-url/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in addImage function:', error);
    throw error;
  }
};