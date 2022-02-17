import React from 'react';
import './seksjon-heading.css';

interface Props {
    heading: string;
}

const SeksjonHeading: React.FC<Props> = ({ heading }) => <h2 className="heading2">{heading}</h2>;

export default SeksjonHeading;
