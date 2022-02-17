import React from 'react';
import './seksjon-heading.css';

interface Props {
    heading: string;
}

const SeksjonHeading: React.FC<Props> = ({ heading }) => <div className="heading2">{heading}</div>;

export default SeksjonHeading;
