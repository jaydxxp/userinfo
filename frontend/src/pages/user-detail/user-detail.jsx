import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/apiService';
import styles from './user-detail.module.css';
import PageHeader from '../../components/PageHeader/PageHeader';
import FormField from '../../components/FormField/FormField';
import AvatarDisplay from '../../components/AvatarDisplay/AvatarDisplay';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.getUserById(id);
        setUser(data.data);
      } catch (error) {
        const msg = error.response?.data?.message || 'User profile not found';
        toast.error(msg);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  if (loading) return <div className={styles.container}>Loading profile...</div>;
  if (!user) return null;

  return (
    <div className={styles.container}>
      <PageHeader title="User Profile" />

      <div className={styles.formCard}>
        <div className={styles.avatarUploadContainer}>
          <div className={styles.avatarWrapper}>
            <AvatarDisplay src={user.profile} size={120} />
          </div>
        </div>

        <div className={styles.formGrid}>
          <FormField label="First Name">
            <div className={styles.readOnlyValue}>{user.firstName}</div>
          </FormField>

          <FormField label="Last Name">
            <div className={styles.readOnlyValue}>{user.lastName}</div>
          </FormField>

          <FormField label="Email Address">
            <div className={styles.readOnlyValue}>{user.email}</div>
          </FormField>

          <FormField label="Mobile (Phone Number)">
            <div className={styles.readOnlyValue}>{user.phoneNumber}</div>
          </FormField>

          <FormField label="Gender">
            <div className={styles.readOnlyValue}>{user.gender}</div>
          </FormField>

          <FormField label="Status">
            <div className={styles.readOnlyValue}>
              <StatusBadge status={user.status} />
            </div>
          </FormField>

          <FormField label="Location">
            <div className={styles.readOnlyValue}>{user.location}</div>
          </FormField>

          <FormField label="Joined On">
            <div className={styles.readOnlyValue}>
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </FormField>
        </div>

        <div className={styles.footer}>
          <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>
            Close
          </Link>
          <Link to={`/edit/${user._id}`} className={`${styles.btn} ${styles.btnPrimary}`}>
            <Edit size={18} />
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
