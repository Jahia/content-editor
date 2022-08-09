import React from 'react';
import {Table, TableBody, TableBodyCell, TableRow, Love} from '@jahia/moonstone';
import styles from './Selection.scss';

const SelectionTable = () => {
    return (
        <div className={styles.selectionTable}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableBodyCell iconStart={<Love color="red"/>}>cell 1</TableBodyCell>
                        <TableBodyCell>cell 2</TableBodyCell>
                        <TableBodyCell>cell 3</TableBodyCell>
                    </TableRow>
                    <TableRow>
                        <TableBodyCell iconStart={<Love color="red"/>}>cell 4</TableBodyCell>
                        <TableBodyCell>cell 5</TableBodyCell>
                        <TableBodyCell>cell 6</TableBodyCell>
                    </TableRow>
                    <TableRow>
                        <TableBodyCell iconStart={<Love color="red"/>}>cell 7</TableBodyCell>
                        <TableBodyCell>cell 8</TableBodyCell>
                        <TableBodyCell>cell 9</TableBodyCell>
                    </TableRow>
                    <TableRow>
                        <TableBodyCell iconStart={<Love color="red"/>}>cell 1</TableBodyCell>
                        <TableBodyCell>cell 2</TableBodyCell>
                        <TableBodyCell>cell 3</TableBodyCell>
                    </TableRow>
                    <TableRow>
                        <TableBodyCell iconStart={<Love color="red"/>}>cell 4</TableBodyCell>
                        <TableBodyCell>cell 5</TableBodyCell>
                        <TableBodyCell>cell 6</TableBodyCell>
                    </TableRow>
                    <TableRow>
                        <TableBodyCell iconStart={<Love color="red"/>}>cell 7</TableBodyCell>
                        <TableBodyCell>cell 8</TableBodyCell>
                        <TableBodyCell>cell 9</TableBodyCell>
                    </TableRow>
                    <TableRow>
                        <TableBodyCell iconStart={<Love color="red"/>}>cell 1</TableBodyCell>
                        <TableBodyCell>cell 2</TableBodyCell>
                        <TableBodyCell>cell 3</TableBodyCell>
                    </TableRow>
                    <TableRow>
                        <TableBodyCell iconStart={<Love color="red"/>}>cell 4</TableBodyCell>
                        <TableBodyCell>cell 5</TableBodyCell>
                        <TableBodyCell>cell 6</TableBodyCell>
                    </TableRow>
                    <TableRow>
                        <TableBodyCell iconStart={<Love color="red"/>}>cell 7</TableBodyCell>
                        <TableBodyCell>cell 8</TableBodyCell>
                        <TableBodyCell>cell 9</TableBodyCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default SelectionTable;
