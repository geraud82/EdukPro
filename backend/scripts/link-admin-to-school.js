// ===========================
// Link Admin User to School
// ===========================

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function linkAdminToSchool() {
  try {
    console.log('🔍 Looking for admin users without a school...');
    
    // Find all admin users without a school
    const adminsWithoutSchool = await prisma.user.findMany({
      where: {
        role: 'admin',
        schoolId: null,
      },
    });

    console.log(`Found ${adminsWithoutSchool.length} admin(s) without a school`);

    if (adminsWithoutSchool.length === 0) {
      console.log('✅ All admins are already linked to schools!');
      return;
    }

    // Find schools
    const schools = await prisma.school.findMany();
    
    console.log(`Found ${schools.length} school(s) in database`);

    if (schools.length === 0) {
      console.log('⚠️  No schools found. Please create a school first.');
      return;
    }

    // Link each admin to the first available school
    // (or you can modify this to be more specific)
    for (const admin of adminsWithoutSchool) {
      const school = schools[0]; // Link to first school
      
      await prisma.user.update({
        where: { id: admin.id },
        data: { schoolId: school.id },
      });

      console.log(`✅ Linked admin "${admin.name}" (${admin.email}) to school "${school.name}"`);
    }

    console.log('\n🎉 All admins have been linked to schools!');
    console.log('⚠️  IMPORTANT: Users need to log out and log back in for changes to take effect.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

linkAdminToSchool();
