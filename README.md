# 💬 ChatVerse

Welcome to **ChatVerse** – a real-time, Google-authenticated chat application built using **Next.js**, **Supabase**, **Tailwind CSS**, and **TypeScript**.

<div align="center">
 

  ![image](https://github.com/user-attachments/assets/e1ecf6cb-f88c-4c75-abe1-d903c434c6d4)

![Uploading image.png…]()

![Uploading image.png…]()



</div>

---

## 🚀 Live Demo

🔗 [ChatVerse is live here](https://whatschatter.vercel.app/)

---

## 📌 Features

- ✅ Google login via Supabase
- ✅ Real-time chat functionality
- ✅ Typing and sending messages stored in Supabase and updated live
- ✅ Pixel-perfect UI (WhatsApp-inspired)
- ✅ All users shown in the chat list with their Google profile picture
- ✅ Open chat and message other users
- ✅ Logout functionality
- ✅ Fully responsive and accessible UI
- ✅ Filters and Search for chats (WIP)
- ✅ Add Labels to chats (WIP)
- ✅ Assign members to chats (WIP)
- ✅ IndexedDB caching (WIP)
- ✅ Group Chat and Media Support (WIP)

---

## 🧱 Tech Stack

- ⚙️ [Next.js](https://nextjs.org/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🔐 [Supabase](https://supabase.com/) (Auth + Realtime DB)
- ⛑️ [TypeScript](https://www.typescriptlang.org/)
- 🎭 [React Icons](https://react-icons.github.io/react-icons/)
- 🧠 IndexedDB (Planned)

---

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chatverse.git
cd chatverse
2. Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
3. Configure Supabase
Create a project on Supabase

Enable Google OAuth Provider

Add redirect URI: http://localhost:3000

Copy your SUPABASE_URL and SUPABASE_ANON_KEY

Create .env.local file

bash
Copy
Edit
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
4. Run Development Server
bash
Copy
Edit
npm run dev
# or
yarn dev
🗃️ Supabase Schema
profiles Table (automatically created)
id - UUID (Primary key, user ID)

email - Text

avatar_url - Text

full_name - Text

messages Table
Column	Type	Description
id	UUID	Primary key
sender_id	UUID	Reference to profiles
receiver_id	UUID	Reference to profiles
content	Text	Message body
created_at	Timestamp	Message timestamp

✨ Deployment
Deployed on Vercel.

🔗 https://whatschatter.vercel.app/

📌 TODO
 Add group chat functionality

 Enable file/image/video attachments

 Use IndexedDB to cache messages

 Improve UI animations and transitions

 Filter/Search functionality

 Assign labels and members to chats

👨‍💻 Author
Developed by Siddhant Mishra

📜 License
This project is licensed under the MIT License.


