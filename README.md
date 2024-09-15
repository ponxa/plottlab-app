# Plottlab App


Certainly! Here's a more detailed explanation of that part:

Plottlab is a web application that allows users to create real-size montages of images. These montages are placed on a white sheet that will be printed using plotter printers. Plotter printers are designed to print large-scale images, often used for banners, signs, and engineering designs.

To ensure that the images are arranged in the most space-efficient way possible on the sheet, Plottlab uses advanced algorithms:

Strip Packing Algorithm: This algorithm arranges the images in a way that minimizes wasted space, similar to how items are packed into a narrow container (or strip). It ensures that the layout is tight and efficient, fitting as many images as possible onto the sheet without overlapping.

Guillotine Heuristic: This method divides the sheet into smaller sections using straight cuts, like a guillotine, to make the layout even more optimized. It helps in organizing the images in such a way that the cuts are simple and material usage is optimized, minimizing waste.

By combining these two techniques, Plottlab makes the most out of each white sheet used in the plotter printer, reducing material waste and enhancing the efficiency of the printing process.

The application is built with Nuxt.js, a framework for creating fast, user-friendly web interfaces, and is deployed using SST (Serverless Stack), which leverages Amazon Web Services (AWS) to provide scalable, cost-effective infrastructure without needing to manage servers manually.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Usage](#usage)
6. [Deployment](#deployment)
7. [Contributing](#contributing)
8. [License](#license)

## Features
-Creation of real-size image montages on a white sheet, optimized for plotter printers.
-Utilizes a strip packing algorithm and guillotine heuristic to efficiently arrange images and minimize material waste.
-Customizable layout options (not related to data visualization like charts or graphs).
-Integration with multiple AWS services through SST.
-User-friendly frontend developed with Nuxt.js and Vue.js.
-Serverless architecture ensuring scalability and cost-effectiveness.

## Tech Stack

- **Frontend:** Nuxt.js, Vue.js
- **Backend/Infrastructure:** SST (Serverless Stack), AWS Lambda, DynamoDB, S3
- **APIs:** AWS API Gateway
- **Database:** AWS DynamoDB
- **CDN:** AWS CloudFront

## Installation

### Prerequisites

- Node.js v16+
- AWS account configured with credentials
- SST CLI installed globally:

```bash
npm install -g sst &
sst start
