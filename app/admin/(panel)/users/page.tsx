import { asc } from 'drizzle-orm';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import AdminForm from '@/src/components/admin/AdminForm';
import DeleteButton from '@/src/components/admin/DeleteButton';
import EditableItem from '@/src/components/admin/EditableItem';
import { Checkbox, SelectField, TextField } from '@/src/components/admin/fields';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { requireUser } from '@/src/server/auth/session';
import { deleteUser, saveUser } from '@/src/server/actions/admin/settings';

export const metadata: Metadata = { title: 'Users' };

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin — kelola konten & paket' },
  { value: 'SUPER_ADMIN', label: 'Super Admin — akses penuh + users' },
];

export default async function AdminUsersPage() {
  const me = await requireUser('SUPER_ADMIN');
  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, active: users.active })
    .from(users)
    .orderBy(asc(users.id));

  return (
    <div className="max-w-4xl space-y-4">
      <PageHeader title="Users" description="Akun yang dapat masuk ke admin panel." />
      <EditableItem title="+ Tambah user">
        <AdminForm action={saveUser} submitLabel="Tambah" resetOnSuccess>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField name="name" label="Nama" />
            <TextField name="email" label="Email" type="email" />
            <TextField name="password" label="Password" type="password" hint="Minimal 8 karakter." />
            <SelectField name="role" label="Role" defaultValue="ADMIN" options={ROLE_OPTIONS} />
          </div>
          <Checkbox name="active" label="Aktif" defaultChecked />
        </AdminForm>
      </EditableItem>
      {rows.map((u) => (
        <EditableItem
          key={u.id}
          title={`${u.name}${u.id === me.id ? ' (Anda)' : ''}`}
          subtitle={u.email}
          badge={<span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${u.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{u.role}{u.active ? '' : ' · NONAKTIF'}</span>}
          actions={u.id !== me.id && <DeleteButton action={deleteUser.bind(null, u.id)} confirmText={`Hapus user ${u.email}?`} />}
        >
          <AdminForm action={saveUser}>
            <input type="hidden" name="id" value={u.id} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField name="name" label="Nama" defaultValue={u.name} />
              <TextField name="email" label="Email" type="email" defaultValue={u.email} />
              <TextField name="password" label="Reset password" type="password" hint="Kosongkan jika tidak diubah." />
              <SelectField name="role" label="Role" defaultValue={u.role} options={ROLE_OPTIONS} />
            </div>
            <Checkbox name="active" label="Aktif" defaultChecked={u.active} />
          </AdminForm>
        </EditableItem>
      ))}
    </div>
  );
}
