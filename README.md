# Plottlab App

Plottlab is a customizable plotting application built with Nuxt.js for the frontend and deployed using SST (Serverless Stack) for managing the serverless infrastructure on AWS.

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

- Customizable data visualization with dynamic plotting options.
- Integration with multiple AWS services using SST.
- User-friendly frontend developed with Nuxt.js and Vue.js.
- Responsive UI.
- Serverless architecture for scalability and cost-effectiveness.

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
