import { deleteFile } from "@/lib/actions/product.actions";
import { credentials } from "@/lib/utils";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const { id } = await params;
  const credId = process.env.CREDENTIAL_ID || "";
  const credential = await credentials(credId);
  try {
    await deleteFile(id, credential);
    return NextResponse.json({ msg: "Ok" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred. Msg: " + error },
      { status: 500 }
    );
  }
}
