import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  User as UserIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/apiService';
import styles from './user-detail.module.css';

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
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>
          <ArrowLeft size={16} />
          Back to list
        </Link>
        <div className={styles.title}>
          <h1>User Profile</h1>
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.avatarUploadContainer}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarPreview}>
              {user.profile ? (
                <img src={user.profile} alt="Profile" className={styles.profileImg} />
              ) : (
                <UserIcon size={40} color="#cbd5e1" />
              )}
            </div>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>First Name</label>
            <div className={styles.readOnlyValue}>{user.firstName}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Last Name</label>
            <div className={styles.readOnlyValue}>{user.lastName}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.readOnlyValue}>{user.email}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mobile (Phone Number)</label>
            <div className={styles.readOnlyValue}>{user.phoneNumber}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Gender</label>
            <div className={styles.readOnlyValue}>{user.gender}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <div className={styles.readOnlyValue}>
              <span className={`${styles.statusBadge} ${user.status === 'Active' ? styles.active : styles.inactive}`}>
                {user.status}
              </span>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Location</label>
            <div className={styles.readOnlyValue}>{user.location}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Joined On</label>
            <div className={styles.readOnlyValue}>
              {new Date(user.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </div>
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
