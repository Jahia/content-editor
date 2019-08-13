package org.jahia.modules.contenteditor.api.forms.impl;

import org.osgi.framework.*;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.security.cert.X509Certificate;
import java.util.*;

class DummyBundle implements Bundle {
    @Override
    public int getState() {
        return 0;
    }

    @Override
    public void start(int options) throws BundleException {

    }

    @Override
    public void start() throws BundleException {

    }

    @Override
    public void stop(int options) throws BundleException {

    }

    @Override
    public void stop() throws BundleException {

    }

    @Override
    public void update(InputStream input) throws BundleException {

    }

    @Override
    public void update() throws BundleException {

    }

    @Override
    public void uninstall() throws BundleException {

    }

    @Override
    public Dictionary<String, String> getHeaders() {
        return null;
    }

    @Override
    public long getBundleId() {
        return 0;
    }

    @Override
    public String getLocation() {
        return null;
    }

    @Override
    public ServiceReference<?>[] getRegisteredServices() {
        return new ServiceReference[0];
    }

    @Override
    public ServiceReference<?>[] getServicesInUse() {
        return new ServiceReference[0];
    }

    @Override
    public boolean hasPermission(Object permission) {
        return false;
    }

    @Override
    public URL getResource(String name) {
        return null;
    }

    @Override
    public Dictionary<String, String> getHeaders(String locale) {
        return null;
    }

    @Override
    public String getSymbolicName() {
        return null;
    }

    @Override
    public Class<?> loadClass(String name) throws ClassNotFoundException {
        return null;
    }

    @Override
    public Enumeration<URL> getResources(String name) throws IOException {
        return null;
    }

    @Override
    public Enumeration<String> getEntryPaths(String path) {
        return null;
    }

    @Override
    public URL getEntry(String path) {
        return null;
    }

    @Override
    public long getLastModified() {
        return 0;
    }

    @Override
    public Enumeration<URL> findEntries(String path, String filePattern, boolean recurse) {
        return Collections.emptyEnumeration();
    }

    @Override
    public BundleContext getBundleContext() {
        return null;
    }

    @Override
    public Map<X509Certificate, List<X509Certificate>> getSignerCertificates(int signersType) {
        return null;
    }

    @Override
    public Version getVersion() {
        return null;
    }

    @Override
    public <A> A adapt(Class<A> type) {
        return null;
    }

    @Override
    public File getDataFile(String filename) {
        return null;
    }

    @Override
    public int compareTo(Bundle o) {
        return 0;
    }
}
