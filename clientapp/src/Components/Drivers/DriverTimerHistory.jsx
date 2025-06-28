import { useEffect, useState } from 'react';
import { format, formatDistanceStrict, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';
import api from '../../Api/axios';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Pagination,
    CircularProgress,
    Alert
} from '@mui/material';

const DriverTimerHistory = () => {
    const [logs, setLogs] = useState([]);
    const [monthLogs, setMonthLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/api/driverlog/list?page=${page}&pageSize=10`);
                setLogs(res.data.items);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error('Failed to load logs:', err);
                setError('Failed to load logs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [page]);

    const exportToExcel = async () => {
        const res = await api.get('/api/driverlog/month');
        const data = res.data;

        setMonthLogs(data);

        const rows = data.map(log => {
            const start = new Date(log.dateStart);
            const end = new Date(log.dateEnd);

            const durationSeconds = (end - start) / 1000;
            const durationHours = (durationSeconds / 3600).toFixed(1);

            return {
                datestart: format(start, 'PPpp'),
                dateend: format(end, 'PPpp'),
                duration_hours: parseFloat(durationHours)
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Driver Logs');

        XLSX.writeFile(workbook, 'driver_timer_logs.xlsx');
    };

    return (
        <Box p={4}>
            <Typography variant="h5" gutterBottom>
                Timer Logs
            </Typography>

            {error && (
                <Box mb={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Date Start</strong></TableCell>
                                    <TableCell><strong>Date End</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log, index) => {
                                    const start = parseISO(log.dateStart);
                                    const end = parseISO(log.dateEnd);

                                    const formattedStart = format(start, "eee, MMM d · h:mm a");
                                    const formattedEnd = format(end, "h:mm a");
                                    const duration = formatDistanceStrict(start, end);

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{formattedStart}</TableCell>
                                            <TableCell>
                                                {formattedEnd} <Typography variant="body2" component="span" color="textSecondary">({duration})</Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="center" mt={3}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                            disabled={totalPages <= 1}
                        />
                    </Box>
                </>
            )}
            <Box mt={4} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={exportToExcel}
                    sx={{
                        padding: '8px 14px',
                        fontWeight: 600,
                        borderRadius: '8px',
                        textTransform: 'none',
                        boxShadow: 2,
                        marginRight:'15%'
                    }}
                >
                    Export month's logs to Excel
                </Button>
            </Box>
        </Box>

    );
};

export default DriverTimerHistory;
