# Getting Started with OO Parking Lot System

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
![parking-lot-web-image](https://user-images.githubusercontent.com/57854970/199880317-6fdad1c8-4bc2-4d60-b13b-8dda97dd35ea.PNG)

### Parking Lot Demo
[Click here to access the demo hosted in AWS S3]([https://nodejs.org/en/download/](http://oo-parking-lot-system.s3-website-ap-southeast-1.amazonaws.com/?fbclid=IwAR3JHG19IWVYfaX3IQFk-0PvHku3F_L6iSVMdJScTFIY_HZqNz9ZfWtUFI8))

## Project Details
OO Parking Lot

You were hired by Ayala Corp. to implement a parking allocation system for their new malling complex, the Object-Oriented Mall. The new parking system will pre-assign a slot for every vehicle coming into the complex. No vehicle can freely choose a parking slot and no vehicle is reserved or assigned a slot until they arrive at the entry point of the complex. The system must assign a parking slot that satisfies the following constraints:

1. There are initially three (3) entry points, and there can be no less than three (3) leading into the parking complex. A vehicle must be assigned a possible and available slot closest to the parking entrance. The mall can decide to add new entrances later.

2. There are three types of vehicles: small (S), medium (M), and large (L), and there are three types of parking slots: small (SP), medium (MP), and large (LP).
(a) S vehicles can park in SP, MP, and LP parking spaces;
(b) M vehicles can park in MP and LP parking spaces; and
(c) L vehicles can park only in LP parking spaces.

3. Your parking system must also handle the calculation of fees, and must meet the following pricing structure:
(a) All types of car pay the flat rate of 40 pesos for the first three (3) hours;
(b) The exceeding hourly rate beyond the initial three (3) hours will be charged as follows:
20/hour for vehicles parked in SP;
60/hour for vehicles parked in MP; and
100/hour for vehicles parked in LP
Take note that exceeding hours are charged depending on parking slot size regardless of vehicle size.

For parking that exceeds 24 hours, every full 24-hour chunk is charged 5,000 pesos regardless of the parking slot.

The remainder hours are charged using the method explained in (b).

Parking fees are calculated using the rounding up method, e.g. 6.4 hours must be rounded to 7.

(c) A vehicle leaving the parking complex and returning within one hour based on their exit time must be charged a continuous rate, i.e. the vehicle must be considered as if it did not leave. Otherwise, rates must be implemented as described. For example, if a vehicle exits at 10:00 and returns at 10:30, continuous rate must apply.

You are free to design the system in any pattern you wish. However, take note that the system assumes the input of the following:

(a) The number of entry points to the parking complex, but no less than three (3). Assume that the entry points are also exit points, so no need to take into account the number of possible exit points.

(b) The map of the parking slot. You are welcome to introduce a design that suits your approach. One suggested method, however, is to accept a list of tuples corresponding to the distance of each slot from every entry point. For example, if your parking system has three (3) entry points. The list of parking spaces may be the following: [(1,4,5), (3,2,3), ...], where the integer entry per tuple corresponds to the distance unit from every parking entry point (A, B, C).

(c) The sizes of every corresponding parking slot. Again, you are welcome to introduce your own design. We suggest using a list of corresponding sizes described in integers: [0, 2, 1, 1, ...] where 0, 1, 2 means small, medium, and large in that order. Another useful design may be a dictionary of parking sizes with corresponding slots as values.

(d) Two functions to park a vehicle and unpark it. The functions must consider the attributes of the vehicle as described above.
When the unpark function is called, it must also return how much the vehicle concerned is charged.

## Available Scripts for Starting the project

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
