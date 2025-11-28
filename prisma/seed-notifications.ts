import { PrismaClient, NotificationType } from '@prisma/client'

const prisma = new PrismaClient()

async function seedNotifications() {
  console.log('🔔 Seeding notifications...')

  try {
    // Get the super admin user
    const superAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@crm.com',
      },
    })

    if (!superAdmin) {
      console.log('❌ Super admin not found. Please run main seed first.')
      return
    }

    // Create sample notifications
    const notifications = [
      {
        userId: superAdmin.id,
        tenantId: superAdmin.tenantId,
        type: NotificationType.DEAL_WON,
        title: '🎉 Deal Won!',
        message: 'Enterprise Software License worth $50,000 was won!',
        actionUrl: '/dashboard/deals',
        read: false,
      },
      {
        userId: superAdmin.id,
        tenantId: superAdmin.tenantId,
        type: NotificationType.TASK_DUE_SOON,
        title: 'Task Due Soon',
        message: 'Follow up with Acme Corp is due tomorrow',
        actionUrl: '/dashboard/tasks',
        read: false,
      },
      {
        userId: superAdmin.id,
        tenantId: superAdmin.tenantId,
        type: NotificationType.CONTACT_CREATED,
        title: 'New Contact Added',
        message: 'John Smith from TechCorp was added to your contacts',
        actionUrl: '/dashboard/contacts',
        read: true,
      },
      {
        userId: superAdmin.id,
        tenantId: superAdmin.tenantId,
        type: NotificationType.CALL_COMPLETED,
        title: 'Call Completed',
        message: 'Discovery call with Sarah Johnson completed successfully',
        actionUrl: '/dashboard/calls',
        read: true,
      },
      {
        userId: superAdmin.id,
        tenantId: superAdmin.tenantId,
        type: NotificationType.DEAL_STAGE_CHANGED,
        title: 'Deal Stage Changed',
        message: 'Cloud Migration Project moved to Negotiation stage',
        actionUrl: '/dashboard/deals',
        read: false,
      },
    ]

    for (const notification of notifications) {
      await prisma.notification.create({
        data: notification,
      })
    }

    console.log(`✅ Created ${notifications.length} sample notifications`)
  } catch (error) {
    console.error('❌ Error seeding notifications:', error)
    throw error
  }
}

seedNotifications()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

