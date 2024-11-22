enum AccessStatus {
    UNDEFINED,
    GRANTED,
    DENIED
}

export interface QrCodeProps {
    id: string;
    qrCode: string;
    access: AccessStatus;
}

export interface UserInfoProps {
    name: string;
    surname: string;
}

export interface SignInProps {
    name: string;
    password: string;
}

export type SignUpProps = UserInfoProps & QrCodeProps & {
    password: string;
}