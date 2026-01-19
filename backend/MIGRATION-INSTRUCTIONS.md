# Database Migration Instructions

## Teacher-Class Many-to-Many Relationship

The database schema has been updated to support many-to-many relationships between teachers and classes.

### Changes Made:
1. Removed single `teacherId` field from `Class` model
2. Added `ClassTeacher` junction table for many-to-many relationships
3. Updated `User` model to reference the new `ClassTeacher` table

### To Apply the Migration:

#### Option 1: Using Prisma Migrate (Recommended)
```bash
cd backend
npx prisma migrate dev --name add_teacher_class_many_to_many
```

#### Option 2: Manual Migration
If the above command fails, run this SQL directly in your database:

```sql
-- Create ClassTeacher junction table
CREATE TABLE "ClassTeacher" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassTeacher_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint to prevent duplicate assignments
CREATE UNIQUE INDEX "ClassTeacher_classId_teacherId_key" ON "ClassTeacher"("classId", "teacherId");

-- Create indexes for better performance
CREATE INDEX "ClassTeacher_classId_idx" ON "ClassTeacher"("classId");
CREATE INDEX "ClassTeacher_teacherId_idx" ON "ClassTeacher"("teacherId");

-- Add foreign key constraints
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_classId_fkey" 
    FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_teacherId_fkey" 
    FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing data (if any classes have teachers assigned)
INSERT INTO "ClassTeacher" ("classId", "teacherId", "assignedAt")
SELECT "id", "teacherId", NOW()
FROM "Class"
WHERE "teacherId" IS NOT NULL;

-- Remove old teacherId column from Class table
ALTER TABLE "Class" DROP COLUMN IF EXISTS "teacherId";

-- Remove old index
DROP INDEX IF EXISTS "Class_teacherId_idx";
```

#### Option 3: Reset and Regenerate
If you're in development and don't mind losing data:
```bash
cd backend
npx prisma migrate reset
npx prisma generate
```

### After Migration:
```bash
# Generate Prisma Client
npx prisma generate

# Restart your backend server
npm run dev
```

## What This Enables:
- ✅ One class can have multiple teachers
- ✅ One teacher can be assigned to multiple classes
- ✅ Admin can assign/unassign teachers from classes
- ✅ Better teacher dashboard showing all assigned classes
- ✅ Track when teachers were assigned to classes
