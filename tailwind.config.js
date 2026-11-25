/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT:'#C9A227', hover:'#A8841A', light:'#E7CA80' },
        cream: { DEFAULT:'#FAF6EC', border:'#E8DFC8' },
        dark: { bg:'#101114', surface:'#191B20', card:'#22252B' },
        success:'#16A34A', error:'#DC2626', warning:'#EA580C',
        'text-primary':'#2B2B2B', 'text-secondary':'#737780',
      },
      fontFamily: {
        display: ['"Be Vietnam Pro"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', '"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins:[],
}
