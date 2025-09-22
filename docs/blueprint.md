# **App Name**: Insight Board

## Core Features:

- Data Ingestion: Parse JSON data representing weekly business metrics, and make it available to the display components.
- Weekly Data Display: Display the 'Datos Semanales' tab with key metrics such as total euros, units, traffic, conversion rate, ACO, GAP, and warehouse occupancy. Show trend indicators (positive/negative variation) for supported fields. Use color-coding to visually represent performance against goals, but note that there are currently no goals in the data structure provided. Do not implement persistence.
- Warehouse Data Visualization: Present detailed information about different warehouse sections (Ropa, Calzado, Perfumería) including occupancy percentage, unit returns, entries, and exits in a tabular format.
- Trend Analysis Tool: Employ an AI tool that analyzes the variation percentages across different metrics (euros, units, traffic, conversion) and suggests potential reasons for observed trends, highlighting both positive and negative aspects. For instance, the tool should explain that a high conversion rate with low traffic means an excellent customer-to-sale ratio. This will help users prioritize their efforts on both strengths and weaknesses of the business.

## Style Guidelines:

- Primary color: Muted teal (#73AFA5) to convey trustworthiness and sophistication without being too corporate.
- Background color: Light grey (#F0F4F3), offering a clean, neutral backdrop that enhances readability.
- Accent color: Soft orange (#D98E5A) to highlight key metrics and interactive elements, drawing attention without overwhelming the user.
- Body and headline font: 'Inter' (sans-serif) for a modern, clean, and readable interface. Note: currently only Google Fonts are supported.
- Use minimalist, line-based icons from Font Awesome to represent different data categories, ensuring consistency and clarity.
- Employ a grid-based layout to ensure data is well-organized and easily scannable, with key metrics prominently displayed in the 'Datos Semanales' tab.
- Implement subtle animations for data updates and transitions to provide a smooth and engaging user experience.