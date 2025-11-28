import { prisma } from '@/lib/db'
import { NotificationType, Prisma } from '@prisma/client'

interface CreateNotificationParams {
  userId: string
  tenantId: string
  type: NotificationType
  title: string
  message: string
  contactId?: string
  dealId?: string
  taskId?: string
  callId?: string
  actionUrl?: string
  metadata?: Prisma.InputJsonValue
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        tenantId: params.tenantId,
        type: params.type,
        title: params.title,
        message: params.message,
        contactId: params.contactId,
        dealId: params.dealId,
        taskId: params.taskId,
        callId: params.callId,
        actionUrl: params.actionUrl,
        metadata: params.metadata,
      },
    })

    return notification
  } catch (error) {
    console.error('[Create Notification] Error:', error)
    return null
  }
}

/**
 * Create notifications for multiple users
 */
export async function createNotifications(
  userIds: string[],
  params: Omit<CreateNotificationParams, 'userId'>
) {
  try {
    const notifications = await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        tenantId: params.tenantId,
        type: params.type,
        title: params.title,
        message: params.message,
        contactId: params.contactId,
        dealId: params.dealId,
        taskId: params.taskId,
        callId: params.callId,
        actionUrl: params.actionUrl,
        metadata: params.metadata,
      })),
    })

    return notifications
  } catch (error) {
    console.error('[Create Notifications] Error:', error)
    return null
  }
}

/**
 * Delete old read notifications (cleanup)
 */
export async function cleanupOldNotifications(daysOld = 30) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.notification.deleteMany({
      where: {
        read: true,
        createdAt: {
          lt: cutoffDate,
        },
      },
    })

    return result.count
  } catch (error) {
    console.error('[Cleanup Notifications] Error:', error)
    return 0
  }
}

