# Task Collections Setup Guide

## Required Collections

You need to create two collections in your Appwrite database for the tasks feature to work.

### 1. Tasks Collection

**Collection Name**: `tasks`  
**Collection ID**: Copy this ID to `.env.local` as `NEXT_PUBLIC_APPWRITE_TASKS_ID`

**Attributes**:

1. **taskId** - String (required, size: 255)
2. **workspaceId** - String (required, size: 255)
3. **statusId** - String (required, size: 255)
4. **title** - String (required, size: 500)
5. **description** - String (optional, size: 5000)
6. **assigneeId** - String (optional, size: 255)
7. **archivedAt** - DateTime (optional, nullable)

**Permissions**:

- **Role: Any** → Read access
- **Role: Users** → Create, Read, Update, Delete access

**Indexes** (optional but recommended for performance):

- `workspaceId` - Key index
- `statusId` - Key index
- `assigneeId` - Key index

---

### 2. Task Statuses Collection

**Collection Name**: `task_statuses`  
**Collection ID**: Copy this ID to `.env.local` as `NEXT_PUBLIC_APPWRITE_TASK_STATUSES_ID`

**Attributes**:

1. **workspaceId** - String (required, size: 255)
2. **name** - String (required, size: 100)
3. **position** - Integer (required, default: 0)

**Permissions**:

- **Role: Any** → Read access
- **Role: Users** → Create, Read, Update, Delete access

**Indexes** (optional but recommended):

- `workspaceId` - Key index

---

## Step-by-Step Instructions

### Creating the Tasks Collection

1. Go to your Appwrite Console
2. Navigate to **Databases** → Select your database
3. Click **"Create Collection"**
4. Enter name: `tasks`
5. Click **"Create"**
6. **Copy the Collection ID** and add to `.env.local`:

   ```env
   NEXT_PUBLIC_APPWRITE_TASKS_ID=<paste_collection_id_here>
   ```

7. Go to the **Attributes** tab
8. Click **"Create Attribute"** for each attribute below:

   **Attribute 1: taskId**
   - Type: String
   - Key: `taskId`
   - Size: 255
   - Required: Yes
   - Click Create

   **Attribute 2: workspaceId**
   - Type: String
   - Key: `workspaceId`
   - Size: 255
   - Required: Yes
   - Click Create

   **Attribute 3: statusId**
   - Type: String
   - Key: `statusId`
   - Size: 255
   - Required: Yes
   - Click Create

   **Attribute 4: title**
   - Type: String
   - Key: `title`
   - Size: 500
   - Required: Yes
   - Click Create

   **Attribute 5: description**
   - Type: String
   - Key: `description`
   - Size: 5000
   - Required: No
   - Click Create

   **Attribute 6: assigneeId**
   - Type: String
   - Key: `assigneeId`
   - Size: 255
   - Required: No
   - Click Create

   **Attribute 7: archivedAt**
   - Type: DateTime
   - Key: `archivedAt`
   - Required: No
   - Click Create

9. Go to **Settings** → **Permissions**
10. Add permissions:
    - **Role: Any** → Check "Read"
    - **Role: Users** → Check "Create", "Read", "Update", "Delete"

---

### Creating the Task Statuses Collection

1. In your database, click **"Create Collection"** again
2. Enter name: `task_statuses`
3. Click **"Create"**
4. **Copy the Collection ID** and add to `.env.local`:

   ```env
   NEXT_PUBLIC_APPWRITE_TASK_STATUSES_ID=<paste_collection_id_here>
   ```

5. Go to the **Attributes** tab
6. Click **"Create Attribute"** for each:

   **Attribute 1: workspaceId**
   - Type: String
   - Key: `workspaceId`
   - Size: 255
   - Required: Yes
   - Click Create

   **Attribute 2: name**
   - Type: String
   - Key: `name`
   - Size: 100
   - Required: Yes
   - Click Create

   **Attribute 3: position**
   - Type: Integer
   - Key: `position`
   - Required: Yes
   - Default: 0
   - Min: 0
   - Click Create

7. Go to **Settings** → **Permissions**
8. Add permissions:
   - **Role: Any** → Check "Read"
   - **Role: Users** → Check "Create", "Read", "Update", "Delete"

---

## Verify Setup

After creating both collections:

1. Check your `.env.local` has both IDs:

   ```env
   NEXT_PUBLIC_APPWRITE_TASKS_ID=your_tasks_collection_id
   NEXT_PUBLIC_APPWRITE_TASK_STATUSES_ID=your_task_statuses_collection_id
   ```

2. Restart your development server:

   ```bash
   npm run dev
   ```

3. Navigate to a workspace and try creating a task

---

## Troubleshooting

**Error: "Unknown attribute: statusId"**

- Make sure all attributes are created with exact names (case-sensitive)
- Verify the statusId attribute is marked as required

**Error: "Missing required attribute: taskId"**

- Ensure the taskId attribute exists and is required

**Permission Errors**

- Check that "Users" role has all CRUD permissions
- Verify "Any" role has Read permission

**Tasks Not Showing**

- Check browser console for errors
- Verify workspace has task statuses created
- Try creating a new task manually in Appwrite Console

---

## Default Task Statuses

When you create a new workspace, the app automatically creates default task statuses:

- **Todo** (position: 0)
- **In Progress** (position: 1)
- **In Review** (position: 2)
- **Done** (position: 3)

These are created automatically via the `seedDefaultTaskStatuses` function.
