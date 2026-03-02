import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface SiteSettingsMap {
  [key: string]: string;
}

const DEFAULT_SETTINGS: SiteSettingsMap = {
  // General Settings
  'site.name': 'CloneVoyant',
  'site.description': 'AI ile web sitesi klonlayın',
  'site.logo': '',
  'site.favicon': '',
  'site.email': 'support@clonevoyant.com',
  'site.phone': '+90 555 123 4567',
  'site.maintenanceMode': 'false',
  'site.maintenanceMessage': 'Sitemiz bakımda. Kısa süre içinde döneceğiz.',
  
  // Payment Settings
  'payment.stripeSecretKey': '',
  'payment.stripePublicKey': '',
  'payment.stripeWebhookSecret': '',
  'payment.paypalClientId': '',
  'payment.paypalClientSecret': '',
  'payment.currency': 'USD',
  'payment.commissionRate': '0',
  'payment.minWithdrawal': '50',
  
  // User Settings
  'user.requireEmailVerification': 'false',
  'user.allowRegistration': 'true',
  'user.defaultCredits': '3',
  'user.freePlanCredits': '3',
  'user.enableSocialLogin': 'true',
  
  // Project Settings
  'project.autoApprove': 'true',
  'project.allowPublicProjects': 'true',
  'project.maxProjectsPerUser': '10',
  'project.enableVersioning': 'true',
  
  // Email Templates
  'email.welcomeSubject': 'Hoş Geldiniz!',
  'email.welcomeBody': 'Merhaba {{name}}, CloneVoyant\'a hoş geldiniz!',
  'email.paymentSubject': 'Ödeme Onayı',
  'email.paymentBody': 'Merhaba {{name}}, {{amount}} tutarındaki ödemeniz onaylandı.',
  'email.resetPasswordSubject': 'Şifre Sıfırlama',
  'email.resetPasswordBody': 'Merhaba {{name}}, şifrenizi sıfırlamak için tıklayın: {{link}}',
  
  // Security
  'security.maxLoginAttempts': '5',
  'security.passwordMinLength': '8',
  'security.sessionTimeout': '24',
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!user?.id || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.siteSettings.findMany();
    const settingsMap: SiteSettingsMap = { ...DEFAULT_SETTINGS };
    
    settings.forEach((setting: { key: string; value: string }) => {
      settingsMap[setting.key] = setting.value;
    });

    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!user?.id || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
    }

    // Upsert all settings
    const operations = Object.entries(settings).map(([key, value]) => {
      return prisma.siteSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ 
      success: true, 
      message: 'Ayarlar başarıyla kaydedildi' 
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!user?.id || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    await prisma.siteSettings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Ayar güncellendi' 
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
