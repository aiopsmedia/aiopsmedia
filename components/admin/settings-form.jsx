'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { saveSiteSettings } from '@/actions/cms';

function Field({ label, name, value, onChange, type = 'text', ...props }) {
  return <Input label={label} name={name} type={type} value={value} onChange={(e) => onChange(name, e.target.value)} {...props} />;
}

export default function SettingsForm({ initialSettings, defaults }) {
  const [settings, setSettings] = React.useState(initialSettings);
  const [saving, setSaving] = React.useState(false);

  const setField = (name, value) => setSettings((prev) => ({ ...prev, [name]: value }));

  const get = (key, fallback = '') => settings[key] ?? fallback;

  const handleSave = async (entries) => {
    setSaving(true);
    try {
      const res = await saveSiteSettings('site', entries);
      if (res?.error) toast.error(res.error);
      else toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const saveGeneral = async () => {
    await handleSave({
      'site.name': get('site.name', defaults.name),
      'site.tagline': get('site.tagline', defaults.tagline),
      'site.url': get('site.url', defaults.url),
    });
  };

  const saveContact = async () => {
    await handleSave({
      'site.email': get('site.email', defaults.email),
      'site.phone': get('site.phone', defaults.phone),
      'site.whatsapp': get('site.whatsapp', defaults.whatsapp),
      'site.address': get('site.address', defaults.address),
      'site.workingHours': get('site.workingHours', defaults.workingHours),
    });
  };

  const saveSocial = async () => {
    await handleSave({
      'social.linkedin': get('social.linkedin'),
      'social.twitter': get('social.twitter'),
      'social.instagram': get('social.instagram'),
      'social.facebook': get('social.facebook'),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Site Settings</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Configure global site settings.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex flex-wrap gap-1 overflow-x-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic site branding and URL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Site Name" name="site.name" value={get('site.name', defaults.name)} onChange={setField} />
              <Field label="Tagline" name="site.tagline" value={get('site.tagline', defaults.tagline)} onChange={setField} />
              <Field label="Site URL" name="site.url" value={get('site.url', defaults.url)} onChange={setField} />
              <Button onClick={saveGeneral} loading={saving}>
                <Save className="h-4 w-4" /> Save
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details displayed on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Email" name="site.email" type="email" value={get('site.email', defaults.email)} onChange={setField} />
              <Field label="Phone" name="site.phone" value={get('site.phone', defaults.phone)} onChange={setField} />
              <Field label="WhatsApp" name="site.whatsapp" value={get('site.whatsapp', defaults.whatsapp)} onChange={setField} />
              <Field label="Address" name="site.address" value={get('site.address', defaults.address)} onChange={setField} />
              <Field label="Working Hours" name="site.workingHours" value={get('site.workingHours', defaults.workingHours)} onChange={setField} />
              <Button onClick={saveContact} loading={saving}>
                <Save className="h-4 w-4" /> Save
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Social media profile URLs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="LinkedIn" name="social.linkedin" value={get('social.linkedin', defaults.social?.linkedin)} onChange={setField} />
              <Field label="Twitter / X" name="social.twitter" value={get('social.twitter', defaults.social?.twitter)} onChange={setField} />
              <Field label="Instagram" name="social.instagram" value={get('social.instagram', defaults.social?.instagram)} onChange={setField} />
              <Field label="Facebook" name="social.facebook" value={get('social.facebook', defaults.social?.facebook)} onChange={setField} />
              <Button onClick={saveSocial} loading={saving}>
                <Save className="h-4 w-4" /> Save
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
