import { useEffect, useState } from 'react';
import { format, formatDistanceStrict, parseISO } from 'date-fns';
import api from '../../Api/axios';
import {
    Box,
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
        </Box>
    );
};

export default DriverTimerHistory;
