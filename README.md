# Shipmate - Student Peer-to-Peer Service Platform

Shipmate is a full-stack web application built for The Ship Campus students to offer and request services within their academic community. The platform serves as a localized marketplace, encouraging collaboration, skill-sharing, and trust through student-verified listings and peer-to-peer communication.

## 🔧 Features

- ✅ **Service Listing & Discovery**  
  Browse and search for services posted by fellow students, categorized by types such as Academic, IT, Creative, etc.

- 🧑‍🎓 **Student Verification System**  
  Only verified students (via student ID and school email) are allowed to post services.

- ✉️ **Messaging System**  
  Built-in chat system for direct communication between service providers and applicants (supports read status and optimistic UI updates).

- 🌟 **Ratings & Reviews**  
  After a service is completed, users can leave anonymous ratings and reviews to help build accountability and trust.

- 🔐 **Authentication**  
  Auth0 is integrated for secure login, registration, and user session management.

- 🧪 **Testing**  
  - Manual Testing: 21 test cases (20 passed, 1 failed)
  - Automated Unit Testing: 31 controller functions tested and passed

## 🛠️ Tech Stack

- **Frontend**: React (Next.js), Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Authentication**: Auth0  
- **Database**: MongoDB (Mongoose ODM)  
- **Testing**: Jest (unit testing for controllers), Postman (manual API testing)
