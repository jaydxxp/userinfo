import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  User as UserIcon,
  Filter,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/apiService';
import styles from './user-list.module.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.getUsers(page, 5, search, status);
      setUsers(data.data);
      setTotalPages(data.pages);
      setTotalUsers(data.total);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch users. Please check your connection.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, status, page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to delete user';
        toast.error(msg);
      }
    }
  };

  const handleExport = () => {
    api.exportUsers();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>User Management</h1>
          <p>Manage and organize your users efficiently</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleExport}>
            <Download size={18} />
            Export CSV
          </button>
          <Link to="/add" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={18} />
            Add User
          </Link>
        </div>
      </header>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className={styles.searchInput}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          
          <div className={styles.filterSection}>
            <div className={styles.filterWrapper}>
              <select 
                className={styles.filterSelect}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Filter by Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            {status && (
              <div className={styles.activeFilters}>
                <button 
                  className={styles.filterChip} 
                  onClick={() => {
                    setStatus('');
                    setPage(1);
                  }}
                  title="Remove Status Filter"
                >
                  <span>{status}</span>
                  <XCircle size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className={styles.emptyState}>
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyState}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatarThumbnail}>
                        {user.profile ? (
                          <img src={user.profile} alt="" className={styles.thumbnailImg} />
                        ) : (
                          <UserIcon size={16} />
                        )}
                      </div>
                      <span className={styles.userName}>{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.location}</td>
                  <td>
                    <span className={`${styles.badge} ${user.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => navigate(`/view/${user._id}`)}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => navigate(`/edit/${user._id}`)}
                      title="Edit User"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(user._id)}
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Showing <b>{users.length}</b> of <b>{totalUsers}</b> users
          </span>
          <div className={styles.pageControls}>
            <button 
              className={`${styles.btn} ${styles.btnSecondary}`} 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              className={`${styles.btn} ${styles.btnSecondary}`}
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default UserList;
