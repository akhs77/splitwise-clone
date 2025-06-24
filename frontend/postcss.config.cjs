
// // This file is used to configure PostCSS, which is a tool for transforming CSS with JavaScript.
// // It includes the Tailwind CSS plugin for utility-first CSS and Autoprefixer for adding    

// export default {
//   plugins: {
//     // '@tailwindcss/postcss': {},
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// }
// ✅ Required for TailwindCSS v4+
// import tailwindcss from '@tailwindcss/postcss';
// import autoprefixer from 'autoprefixer';

// export default {
//   plugins: [
//     tailwindcss,
//     autoprefixer,
//   ],
// };

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};