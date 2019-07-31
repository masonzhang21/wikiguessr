package com.example.starlight;

import android.content.Context;
import android.nfc.Tag;
import android.opengl.GLES20;
import android.opengl.GLSurfaceView;
import android.opengl.Matrix;
import android.util.Log;

import java.io.IOException;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

public class MyGLRenderer implements GLSurfaceView.Renderer {


    private Sphere mSphere;
    private Triangle mTriangle;
    private Context mContext;
    private final float[] vPMatrix = new float[16];
    private final float[] projectionMatrix = new float[16];
    private final float[] viewMatrix = new float[16];
    private final float[] translateMatrix = new float[16];
    private final float[] mVPMatrix = new float[16];

    public MyGLRenderer(Context context){
        mContext = context;

    }
    public void onSurfaceCreated(GL10 unused, EGLConfig config){
        //GLES20.glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
        //mSphere = new Sphere(mContext);
        mTriangle = new Triangle();
        translateMatrix[0]=1;
        translateMatrix[1]=0;
        translateMatrix[2]=0;
        translateMatrix[3]=0;

        translateMatrix[4]=0;
        translateMatrix[5]=1;
        translateMatrix[6]=0;
        translateMatrix[7]=0;

        translateMatrix[8]=0;
        translateMatrix[9]=0;
        translateMatrix[10]=7;
        translateMatrix[11]=0;

        translateMatrix[12]=0;
        translateMatrix[13]=0;
        translateMatrix[14]=0;
        translateMatrix[15]=1;


    }

    public void onDrawFrame(GL10 unused){
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT);
        //float[] lookAt = new float[3];
        //lookAt = getPointing();

        Log.d("MYGLRenderer.java", "drawing");
        // Set the camera position (View matrix)
        Matrix.setLookAtM(viewMatrix, 0, 0, 0, -3, 0f, 0f, 0f, 0f, 1.0f, 0.0f);


        // Calculate the projection and view transformation
        Matrix.multiplyMM(vPMatrix, 0, projectionMatrix, 0, viewMatrix, 0);
       // Matrix.translateM(translateMatrix, 0, 0, 0, 1);
       Matrix.multiplyMM(mVPMatrix, 0, vPMatrix, 0, translateMatrix, 0);
        // Draw shape
        //mSphere.draw(vPMatrix);
        mTriangle.draw(mVPMatrix);
    }

    public void onSurfaceChanged(GL10 unused, int width, int height){
        GLES20.glViewport(0,0, width, height);
        float ratio = (float) width / height;

        // this projection matrix is applied to object coordinates
        // in the onDrawFrame() method
        Matrix.frustumM(projectionMatrix, 0, -ratio, ratio, -2, 2, 3, 7);
    }

    public static int loadShader(int type, String shaderCode){
        int shader = GLES20.glCreateShader(type);
        Log.d("MYGLRenderer.java", "int shader:"+shader);
        GLES20.glShaderSource(shader, shaderCode);
        GLES20.glCompileShader(shader);
        return shader;
    }
}
